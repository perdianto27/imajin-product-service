const express = require('express');
const Router = express.Router();

const { verifyBasic  } = require('../middleware/auth/basic-auth');

const { validator  } = require('../middleware/validator');
const { postUserValidation  } = require('../middleware/validator/schema/UserValidation');

const { ROLE  } = require('../helpers/constant');
const user = require('../controller/UserController');

Router.post('/', verifyBasic([ROLE.ID.ADMIN], { optional: true }), validator(postUserValidation), user.postUser);
Router.get('/', verifyBasic([ROLE.ID.ADMIN]), user.getUser);

module.exports = Router;