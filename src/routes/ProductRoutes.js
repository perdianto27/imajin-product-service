const express = require('express');
const Router = express.Router();

const { verifyBasic  } = require('../middleware/auth/basic-auth');

const { validator } = require('../middleware/validator');
const { postProduct } = require('../middleware/validator/schema/ProductValidation');

const { ROLE  } = require('../helpers/constant');
const product = require('../controller/ProductController');

Router.get('/', verifyBasic(), product.getProducts);
Router.post('/', verifyBasic([ROLE.ID.ADMIN]), validator(postProduct), product.postProduct);

module.exports = Router;