const express = require('express');
const Router = express.Router();

const { verifyBasic  } = require('../middleware/auth/basic-auth');

const { validator  } = require('../middleware/validator');
const { addCartValidation, checkoutCartValidation  } = require('../middleware/validator/schema/CartValidation');

const { ROLE  } = require('../helpers/constant');
const cart = require('../controller/CartController');

Router.post('/', verifyBasic([ROLE.ID.CUSTOMER]), validator(addCartValidation), cart.addToCart);
Router.delete('/item/:productId', verifyBasic([ROLE.ID.CUSTOMER]), cart.removeFromCart);
Router.post('/checkout', verifyBasic([ROLE.ID.CUSTOMER]), validator(checkoutCartValidation), cart.postCheckoutCart);

module.exports = Router;