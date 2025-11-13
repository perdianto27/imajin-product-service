module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true
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
    tableName: "carts",
    timestamps: false,
    underscored: false
  });

  Cart.associate = (models) => {
    Cart.hasMany(models.CartItem, { foreignKey: "cart_id", as: "items", onDelete: "CASCADE" });
  };

  return Cart;
};