module.exports = (sequelize, DataTypes) => {
  const UserSession = sequelize.define("UserSession", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    device_info: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "user_sessions",
    timestamps: false,
    underscored: true,
  });

  // Relasi ke User
  UserSession.associate = (models) => {
    UserSession.belongsTo(models.User, {
      foreignKey: "email",
      as: "user"
    });
  };

  return UserSession;
};