const express = require('express');
const Router = express.Router();

const auth = require('./AuthRoutes');
const user = require('./UserRoutes');
const product = require('./ProductRoutes');
const cart = require('./CartRoutes');
const report = require('./ReportRoutes');

Router.use('/auth', auth);
Router.use('/user', user);
Router.use('/product', product);
Router.use('/cart', cart);
Router.use('/report', report);

module.exports = Router;