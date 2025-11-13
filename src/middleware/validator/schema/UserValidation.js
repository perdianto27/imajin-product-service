const Joi = require('joi');

const postUserValidation = Joi.object({
  email: Joi.string().required(),
  roleId: Joi.number().required(),
  name: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = {
  postUserValidation
}