const Joi = require('joi');

const postProduct = Joi.object({
  sku: Joi.string().max(64).optional(),
  name: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  price: Joi.number().precision(2).min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  is_active: Joi.boolean().default(true)
});

module.exports = {
  postProduct
};