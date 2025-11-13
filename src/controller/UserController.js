const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');

const { User, Role } = require("../models");

const Logger = require('../helpers/logger');

const logName = 'API User';

const postUser = async (request, reply) => {
  const ctx = `${logName}-postUser`;
  try {
    const { email, name, password, roleId } = request.body;

    const newUser = {
      email,
      full_name: name,
      role_id: roleId,
      password_hash: await bcrypt.hash(password, 10)
    };

    await User.create(newUser)
    return reply
    .status(StatusCodes.CREATED)
    .send({
      responseCode: StatusCodes.CREATED,
      responseDesc: "Data berhasil disimpan"
  });
  } catch (err) {
    Logger.log([ctx, 'POST User', 'ERROR'], {
      message: `${err}`,
    });
    Logger.logToDB(ctx, err, request);
    return reply
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({
        responseCode: StatusCodes.INTERNAL_SERVER_ERROR,
        responseDesc: "Data gagal disimpan"
    });
  }
};

const getUser = async (request, reply) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name']
        }
      ]
    });

    return reply
    .status(StatusCodes.OK)
    .send({
      responseCode: StatusCodes.OK,
      responseDesc: "Berhasil mengambil data",
      data: users
  });
  } catch (err) {
    Logger.log([logName, 'GET User', 'ERROR'], {
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
  postUser,
  getUser
};