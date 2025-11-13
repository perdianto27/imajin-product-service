const { StatusCodes } = require('http-status-codes');
const Jwt = require('jsonwebtoken');

const Logger = require('../../helpers/logger');

const context = "middlewareAuth";

const { UserSession } = require("../../models");

const verifyBasic = (roles = [], { optional = false } = {}) => {
  const ctx = `${context}.verifyBasic`;

  return async (request, reply, next) => {
    try {
      const authHeader = request.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        if (optional) {
          request.user = null;

          return next();
        }
        return reply.status(StatusCodes.UNAUTHORIZED).send({
          responseCode: StatusCodes.UNAUTHORIZED,
          responseDesc: "Missing or invalid Authorization header",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = Jwt.verify(token, process.env.JWT_SECRET);
      const session = await UserSession.findOne({
        where: { email: decoded.email, token },
      });

      if (!session) {
        return reply.status(StatusCodes.UNAUTHORIZED).send({
          responseCode: StatusCodes.UNAUTHORIZED,
          responseDesc: "Session expired or logged out",
        });
      }

      if (roles.length && !roles.includes(decoded.roleId)) {
        return reply.status(StatusCodes.FORBIDDEN).json({
          responseCode: StatusCodes.FORBIDDEN,
          responseDesc: "Access denied: insufficient permissions",
        });
      }

      request.user = decoded;

      next();
    } catch (err) {
      Logger.log([ctx, "Error verify basic", "ERROR"], {
        error: `${err}`,
      });

      if (err instanceof Jwt.TokenExpiredError) {
        return reply.status(StatusCodes.UNAUTHORIZED).send({
          responseCode: StatusCodes.UNAUTHORIZED,
          responseDesc: "Access token expired!",
        });
      }

      return reply.status(StatusCodes.UNAUTHORIZED).send({
        responseCode: StatusCodes.UNAUTHORIZED,
        responseDesc: "Unauthorized",
      });
    }
  };
};

module.exports = { verifyBasic };