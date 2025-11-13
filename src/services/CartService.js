const { StatusCodes } = require('http-status-codes');

const { Cart, CartItem, Product, Order, OrderItem, sequelize } = require('../models');
const createError = require('../utils/customError');
const Logger = require('../helpers/logger');

const logName = 'Service Cart';

const addToCartService = async (email, productId, quantity = 1) => {
  const t = await sequelize.transaction();
  try {
    const product = await Product.findOne({
      where: { id: productId, is_active: true },
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    if (!product) throw createError('Produk tidak ditemukan', StatusCodes.NOT_FOUND);
    if (product.stock < quantity) {
      throw createError('Stock produk tidak mencukupi', StatusCodes.BAD_REQUEST);
    }

    let cart = await Cart.findOne({ where: { email }, transaction: t });
    if (!cart) cart = await Cart.create({ email }, { transaction: t });

    let cartItem = await CartItem.findOne({ where: { cart_id: cart.id, product_id: productId }, transaction: t });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save({ transaction: t });
    } else {
      cartItem = await CartItem.create({ cart_id: cart.id, product_id: productId, quantity }, { transaction: t });
    }

    await t.commit();
    return cartItem;
  } catch (err) {
    await t.rollback();
    Logger.log([logName, 'ADD Cart', 'ERROR'], {
      message: `${err}`,
    });
    throw err;
  }
};

const removeFromCartService = async (email, productId) => {
  try {
    const cart = await Cart.findOne({ where: { email } });
    if (!cart) {
      throw new createError('Keranjang tidak ditemukan', StatusCodes.NOT_FOUND);
    }

    const deleted = await CartItem.destroy({
      where: { cart_id: cart.id, product_id: productId }
    });

    if (!deleted) {
      throw new createError('Buku tidak ada di keranjang', StatusCodes.NOT_FOUND);
    }

    return cart;
  } catch (err) {
    Logger.log([logName, 'Remove from Cart', 'ERROR'], {
      message: `${err}`,
    });

    throw err;
  }
};


const checkoutCartService = async (email, paymentChannel, paymentReference) => {
  const t = await sequelize.transaction();
  try {
    const cart = await Cart.findOne({
      where: { email },
      include: [{ model: CartItem, as: 'items' }],
      transaction: t
    });

    if (!cart || cart.items.length === 0) throw new createError('Keranjang kosong', StatusCodes.BAD_REQUEST);
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await Product.findOne({ where: { id: item.product_id }, lock: t.LOCK.UPDATE, transaction: t });
      if (!product || product.stock < item.quantity) 
      throw createError(`Stock tidak mencukupi untuk buku ${product.title}`, StatusCodes.BAD_REQUEST);
      totalAmount += Number(product.price) * item.quantity;
    }

    const order = await Order.create({
      email,
      order_number: `ORD-${Date.now()}`,
      total_amount: totalAmount,
      status: 'pending',
      payment_channel: paymentChannel,
      payment_reference: paymentReference
    }, { transaction: t });

    for (const item of cart.items) {
      const product = await Product.findOne({ where: { id: item.product_id }, transaction: t });
      await OrderItem.create({
        order_id: order.id,
        product_id: product.id,
        unit_price: product.price,
        quantity: item.quantity,
        subtotal: Number(product.price) * item.quantity
      }, { transaction: t });

      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });

    await t.commit();
    return order;
  } catch (err) {
    await t.rollback();
    Logger.log([logName, 'Checkout Cart', 'ERROR'], {
      message: `${err}`,
    });
    throw err;
  }
};

module.exports = {
  addToCartService,
  removeFromCartService,
  checkoutCartService
};
