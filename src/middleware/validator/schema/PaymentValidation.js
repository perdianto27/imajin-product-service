const Joi = require('joi');

const paymentValidation = Joi.object({
  orderId: Joi.string().guid({ version: 'uuidv4' }).required(),
  paymentChannel: Joi.string().required(),
});

module.exports = {
  paymentValidation
};