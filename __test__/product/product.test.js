jest.mock("../../src/config/database");

jest.mock('../../src/models', () => ({
  Product: {
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn()
  },
  UserSession: {
    findOne: jest.fn(),
  }
}));

const request = require('supertest');

const TestHelper = require('../testHelper');
const JWTHelpers = require('../../src/helpers/jwtHelpers');

const ProductPlugin = require('../../src/routes/ProductRoutes');
const { Product, UserSession } = require("../../src/models/");

let server;

describe("Product", () => {
  
  beforeAll(() => {
    server = TestHelper.createTestServer('/product', ProductPlugin);
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await server.close();
  });

  test("It should return status response 200: Successfully POST Products", async () => {
    const req = {
      body: {
        email: "dira@gmail.com",
        roleId: 2
      }
    }

    const payload = {
      sku: "KK-KM-2025",
      name: "Kursi Kayu Mahoni",
      description: "Kursi kayu minimalis dengan desain ergonomis yang cocok untuk ruang tamu atau ruang makan.",
      price: 440000.50,
      stock: 12,
      is_active: true
    }

    process.env.JWT_SECRET = 'supersecretjwtkey123';
    process.env.JWT_EXPIRES = '1h';

    const token = await JWTHelpers.generateToken(req.body);
    const mockSession = { id: 64, email: "dira@gmail.com", token: token.access_token };

    UserSession.findOne.mockResolvedValue(mockSession);

    Product.create.mockResolvedValue(payload);

    await request(server)
      .post('/product')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send(payload)
      .expect(201)
      .then((res) => {
        expect(res.body.responseCode).toEqual(201);
      });
  });

  test("It should return status response 200: Successfully GET All Products", async () => {
    const req = {
      body: {
        email: "dira@gmail.com",
        roleId: 2
      }
    }
    process.env.JWT_SECRET = 'supersecretjwtkey123';
    process.env.JWT_EXPIRES = '1h';

    const token = await JWTHelpers.generateToken(req.body);
    const mockSession = { id: 64, email: "dira@gmail.com", token: token.access_token };
    UserSession.findOne.mockResolvedValue(mockSession);

    Product.findAll.mockResolvedValue([{
      id: 1,
      sku: "KK-KM-2025",
      name: "Kursi Kayu Mahoni",
      description: "Kursi kayu minimalis dengan desain ergonomis yang cocok untuk ruang tamu atau ruang makan.",
      price: 440000.50,
      stock: 12,
      is_active: true
    }]);
    
    await request(server)
      .get('/product')
      .set('Authorization', `Bearer ${token.access_token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });
});
