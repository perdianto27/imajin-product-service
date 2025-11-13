module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    unit_price: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
      validate: { min: 0 }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    subtotal: {
      type: DataTypes.DECIMAL(14,2),
      allowNull: false,
      validate: { min: 0 }
    }
  }, {
    tableName: "order_items",
    timestamps: false,
    underscored: true
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "order_id", as: "order" });
    OrderItem.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
  };

  return OrderItem;
};