const { StatusCodes } = require('http-status-codes');

const { Product } = require("../models");

const Logger = require('../helpers/logger');

const { ROLE } = require('../helpers/constant');

const { Op, where } = require('sequelize');

const logName = 'API Product';

const postProduct = async (request, reply) => {
  try {

    await Product.create(request.body)

    return reply
    .status(StatusCodes.CREATED)
    .send({
      responseCode: StatusCodes.CREATED,
      responseDesc: "Data berhasil disimpan"
  });
  } catch (err) {
    Logger.log([logName, 'POST Product', 'ERROR'], {
      message: `${err}`,
    });
    return reply
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({
        responseCode: StatusCodes.INTERNAL_SERVER_ERROR,
        responseDesc: "Data gagal disimpan"
    });
  }
};

const getProducts = async (request, reply) => {
  try {
    const { user } = request || {};
    const roleId = user?.roleId;
    
    let where = {};
    if (roleId === ROLE.ID.CUSTOMER) {
      where = { stock: { [Op.gt]: 0 }, is_active: true };
    }

    const products = await Product.findAll({ where });
    const mappedProducts = products.map((p) => {
      const plain = p.get ? p.get({ plain: true }) : p;
      return { ...plain };
    });

    return reply
    .status(StatusCodes.OK)
    .send({
      responseCode: StatusCodes.OK,
      responseDesc: "Berhasil mengambil data",
      data: mappedProducts
  });
  } catch (err) {
    Logger.log([logName, 'GET Products', 'ERROR'], {
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


const getProductById = async (request, reply) => {
  try {
    const productId = request.params.id
    const product = await Product.findByPk(productId);

    if (!product) {
      return reply.status(StatusCodes.NOT_FOUND).send({
        responseCode: StatusCodes.NOT_FOUND,
        responseDesc: "Buku tidak ditemukan"
      });
    }

    const detail = {
      ...product.toJSON(),
      price: Math.floor(product.price)
    };

    return reply.status(StatusCodes.OK).send({
      responseCode: StatusCodes.OK,
      responseDesc: "Berhasil mengambil data",
      data: detail
    });
  } catch (error) {
    Logger.log([logName, 'GET product by ID', 'ERROR'], { message: `${error}` });
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      responseCode: StatusCodes.INTERNAL_SERVER_ERROR,
      responseDesc: "Gagal mengambil data"
    });
  }
};

module.exports = {
  postProduct,
  getProducts,
  getProductById
};