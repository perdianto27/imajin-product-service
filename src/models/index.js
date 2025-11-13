const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./User")(sequelize, Sequelize.DataTypes);
const Role = require("./Role")(sequelize, Sequelize.DataTypes);
const UserSession = require("./UserSession")(sequelize, Sequelize.DataTypes);
const Product = require("./Product")(sequelize, Sequelize.DataTypes);
const Cart = require("./Cart")(sequelize, Sequelize.DataTypes);
const CartItem = require("./CartItem")(sequelize, Sequelize.DataTypes);
const Order = require("./Order")(sequelize, Sequelize.DataTypes);
const OrderItem = require("./OrderItem")(sequelize, Sequelize.DataTypes);

const ErrorLog = require("./ErrorLog")(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  User,
  Role,
  UserSession,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  ErrorLog
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;