const express = require('express');
const Router = express.Router();

const { limiter } = require('../middleware/rateLimiter');

const auth = require('../controller/AuthController');

Router.post('/login', limiter, auth.postLogin);

module.exports = Router;