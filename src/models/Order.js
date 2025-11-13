module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false
    },
    order_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    total_amount: {
      type: DataTypes.DECIMAL(14,2),
      allowNull: false,
      validate: { min: 0 }
    },
    status: {
      type: DataTypes.ENUM('pending','paid','failed','cancelled'),
      allowNull: false
    },
    payment_channel: {
      type: DataTypes.STRING(100)
    },
    payment_reference: {
      type: DataTypes.STRING(255)
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "orders",
    timestamps: false,
    underscored: true
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, { foreignKey: "order_id", as: "items", onDelete: "CASCADE" });
  };

  return Order;
};