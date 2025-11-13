const { StatusCodes } = require('http-status-codes');

const validator = (schema, payloadType = "body") => {
  return async (req, reply, next) => {
    let payload;

    if (payloadType === "body") {
      payload = req.body;
    } else if (payloadType === "params") {
      payload = req.params;
    } else {
      payload = req.query;
    }

    const { error } = schema.validate(payload);
    if (error) {
      return reply.status(StatusCodes.BAD_REQUEST)
        .send({
          responseCode: StatusCodes.BAD_REQUEST,
          responseDesc: error.details[0].message // Tampilkan pesan error Joi
        });
    }

    next();
  };
};

module.exports = {
  validator
};