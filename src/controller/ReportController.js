const { StatusCodes } = require('http-status-codes');

const { Product, Order, OrderItem } = require("../models");

const Logger = require('../helpers/logger');
const logName = 'API Report';

const getCheckoutList = async (request, reply) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['name'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return reply.status(StatusCodes.OK).send({
      responseCode: StatusCodes.OK,
      responseDesc: "Berhasil mengambil data transaksi checkout",
      data: orders
    });
  } catch (err) {
    Logger.log([logName, 'GET Checkout List', 'ERROR'], {
      message: `${err}`,
    });
    return reply
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({
        responseCode: StatusCodes.INTERNAL_SERVER_ERROR,
        responseDesc: "Gagal mengambil data"
    });
  }
};

module.exports = {
  getCheckoutList
};