jest.mock("../../src/config/database", () => ({
  transaction: jest.fn()
}));

jest.mock('../../src/models', () => ({
  Cart: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  CartItem: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  },
  Product: {
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  Order: {
    create: jest.fn()
  },
  OrderItem: {
    create: jest.fn()
  },
  UserSession: {
    findOne: jest.fn()
  },
  sequelize: {
    transaction: jest.fn()
  }
}));

const request = require('supertest');
const TestHelper = require('../testHelper');
const JWTHelpers = require('../../src/helpers/jwtHelpers');
const CartRoutes = require('../../src/routes/CartRoutes');
const { Cart, CartItem, Product, Order, OrderItem, UserSession, sequelize } = require("../../src/models");

let server;

describe("Cart & Checkout Controller (PostgreSQL Compatible)", () => {
  let mockTransaction;

  beforeAll(() => {
    server = TestHelper.createTestServer('/cart', CartRoutes);
    process.env.JWT_SECRET = 'supersecretjwtkey123';
    process.env.JWT_EXPIRES = '1h';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction = {
      commit: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true),
      LOCK: { UPDATE: 'UPDATE' }
    };
    sequelize.transaction.mockResolvedValue(mockTransaction);
  });

  afterAll(async () => {
    await server.close();
  });

  test("Add to cart - successfully creates item with UUID", async () => {
    const token = await JWTHelpers.generateToken({ email: "dira@gmail.com", roleId: 1 });
    UserSession.findOne.mockResolvedValue({ id: 64, email: "dira@gmail.com", token: token.access_token });

    const mockProductId = "531b8a11-c0ef-4a8a-8e71-0363d98b5e78";
    const mockCartId = "e9ef350a-d45b-450e-8311-ea8b32bff1d9";
    const mockCartItemId = "0ddff5a7-7a9a-4a3e-839b-099a11729463";

    Product.findOne.mockResolvedValue({
      id: mockProductId,
      name: "Meja Makan",
      stock: 10,
      is_active: true
    });

    Cart.findOne.mockResolvedValue({ id: mockCartId, email: "dira@gmail.com" });
    CartItem.findOne.mockResolvedValue(null);
    CartItem.create.mockResolvedValue({
      id: mockCartItemId,
      cart_id: mockCartId,
      product_id: mockProductId,
      quantity: 2
    });

    await request(server)
      .post('/cart')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send({ productId: mockProductId, quantity: 2 })
      .expect(200)
      .then((res) => {
        expect(res.body.responseCode).toEqual(200);
        expect(res.body.data.id).toEqual(mockCartItemId);
        expect(mockTransaction.commit).toHaveBeenCalled();
      });
  });

  test("Checkout cart - successfully creates Order, OrderItems, reduces stock & commits transaction", async () => {
    const token = await JWTHelpers.generateToken({ email: "dira@gmail.com", roleId: 1 });
    UserSession.findOne.mockResolvedValue({ id: 64, email: "dira@gmail.com", token: token.access_token });

    const mockProductId = "531b8a11-c0ef-4a8a-8e71-0363d98b5e78";
    const mockCartId = "e9ef350a-d45b-450e-8311-ea8b32bff1d9";
    const mockOrderId = "3bbba343-37f7-4b6a-a82a-cd276bb46a57";

    Cart.findOne.mockResolvedValue({
      id: mockCartId,
      email: "dira@gmail.com",
      items: [
        { id: "item-1", cart_id: mockCartId, product_id: mockProductId, quantity: 2 }
      ]
    });

    const mockProduct = {
      id: mockProductId,
      name: "Meja Makan",
      price: "800000.00",
      stock: 5,
      save: jest.fn().mockResolvedValue(true)
    };

    Product.findOne.mockResolvedValue(mockProduct);

    Order.create.mockResolvedValue({
      id: mockOrderId,
      email: "dira@gmail.com",
      order_number: "ORD-12345",
      total_amount: 1600000.00,
      status: "pending"
    });

    OrderItem.create.mockResolvedValue({
      id: "order-item-1",
      order_id: mockOrderId,
      product_id: mockProductId,
      unit_price: "800000.00",
      quantity: 2,
      subtotal: 1600000.00
    });

    CartItem.destroy.mockResolvedValue(1);

    await request(server)
      .post('/cart/checkout')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send({ paymentChannel: "BCA", paymentReference: "VA9876543210" })
      .expect(200)
      .then((res) => {
        expect(res.body.responseCode).toEqual(200);
        expect(res.body.data.id).toEqual(mockOrderId);
        expect(mockProduct.stock).toEqual(3); // 5 - 2 = 3
        expect(mockProduct.save).toHaveBeenCalled();
        expect(mockTransaction.commit).toHaveBeenCalled();
      });
  });

  test("Checkout cart - rolls back transaction when product stock is insufficient", async () => {
    const token = await JWTHelpers.generateToken({ email: "dira@gmail.com", roleId: 1 });
    UserSession.findOne.mockResolvedValue({ id: 64, email: "dira@gmail.com", token: token.access_token });

    const mockProductId = "531b8a11-c0ef-4a8a-8e71-0363d98b5e78";

    Cart.findOne.mockResolvedValue({
      id: "cart-1",
      email: "dira@gmail.com",
      items: [
        { id: "item-1", product_id: mockProductId, quantity: 10 }
      ]
    });

    Product.findOne.mockResolvedValue({
      id: mockProductId,
      name: "Meja Makan",
      price: "800000.00",
      stock: 2 // insufficient
    });

    await request(server)
      .post('/cart/checkout')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send({ paymentChannel: "BCA", paymentReference: "VA9876543210" })
      .expect(400)
      .then((res) => {
        expect(res.body.responseCode).toEqual(400);
        expect(mockTransaction.rollback).toHaveBeenCalled();
      });
  });
});
