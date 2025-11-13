const Joi = require('joi');

const addCartValidation = Joi.object({
  productId: Joi.string().guid({ version: 'uuidv4' }).required(),
  quantity: Joi.number().integer().min(1).default(1)
});

const checkoutCartValidation = Joi.object({
  paymentChannel: Joi.string().required(),
  paymentReference: Joi.string().optional().allow('', null)
});

module.exports = {
  addCartValidation,
  checkoutCartValidation
};