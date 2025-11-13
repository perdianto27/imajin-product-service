const { StatusCodes } = require('http-status-codes');

const Logger = require('../helpers/logger');
const JwtHelpers = require('../helpers/jwtHelpers');

const { User, UserSession } = require("../models");

const logName = 'API Auth';

const postLogin = async (request, reply) => {
  try {
    const { email } = request.body;

    const user = await User.findOne({ where: { email } });
    if (user === null) {
      return reply
        .status(StatusCodes.NOT_FOUND)
        .send({
          responseCode: StatusCodes.NOT_FOUND,
          responseDesc: "User tidak ditemukan"
        });
    }

    await UserSession.destroy({ where: { email } });
    const dtAccess = {email, roleId : user.role_id};
    const token = await JwtHelpers.generateToken(dtAccess);
    await UserSession.create({
      email: user.email,
      ip_address: request.ip,
      token: token.access_token,
      device_info: request.headers['user-agent']
    });

    return reply
    .status(StatusCodes.OK)
    .send({
      responseCode: StatusCodes.OK,
      responseDesc: "Login berhasil",
      data: token
    });
  } catch (error) {
    Logger.log([logName, 'POST Login', 'ERROR'], {
      message: `${error}`,
    });
    return reply
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({
        responseCode: StatusCodes.INTERNAL_SERVER_ERROR,
        responseDesc: "Wrong Username or Password"
    });
  }
};

module.exports = {
  postLogin
};