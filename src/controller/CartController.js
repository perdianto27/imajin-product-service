const { StatusCodes } = require('http-status-codes');

const Logger = require('../helpers/logger');

const { addToCartService, removeFromCartService, checkoutCartService } = require('../services/CartService');

const logName = 'API Cart';

const addToCart = async (request, reply) => {
  try {
    const { productId, quantity } = request.body;
    const email = request.user.email;
    const cartItem = await addToCartService(email, productId, quantity || 1);

    return reply
    .status(StatusCodes.OK)
    .send({
      responseCode: StatusCodes.OK,
      responseDesc: "Buku berhasil ditambahkan ke keranjang",
      data: cartItem
  });
  } catch (err) {
    Logger.log([logName, 'POST Add Cart', 'ERROR'], {
      message: `${err}`,
    });
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return reply
      .status(statusCode)
      .send({
        responseCode: statusCode,
        responseDesc: err.message || "Terjadi kesalahan pada server"
    });
  }
};

const removeFromCart = async (request, reply) => {
  try {
    const { productId } = request.params;
    const email = request.user.email;
    await removeFromCartService(email, productId);

    return reply
    .status(StatusCodes.OK)
    .send({
      responseCode: StatusCodes.OK,
      responseDesc: "Buku berhasil dihapus dari keranjang"
  });
  } catch (err) {
    Logger.log([logName, 'POST Remove from Cart', 'ERROR'], {
      message: `${err}`,
    });
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return reply
      .status(statusCode)
      .send({
        responseCode: statusCode,
        responseDesc: err.message || "Terjadi kesalahan pada server"
    });
  }
};

const postCheckoutCart = async (request, reply) => {
  try {
    const { paymentChannel, paymentReference } = request.body;
    const email = request.user.email;

    const order = await checkoutCartService (email, paymentChannel, paymentReference);

    return reply
    .status(StatusCodes.OK)
    .send({
      responseCode: StatusCodes.OK,
      responseDesc: 'Checkout berhasil',
      data: order
    });
  } catch (err) {
    Logger.log([logName, 'POST Checkout Cart', 'ERROR'], {
        message: `${err}`,
    });
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return reply
      .status(statusCode)
      .send({
        responseCode: statusCode,
        responseDesc: err.message || "Terjadi kesalahan pada server"
    });
  }
};


module.exports = {
  addToCart,
  removeFromCart,
  postCheckoutCart
};