module.exports = (sequelize, DataTypes) => {
  const ErrorLog = sequelize.define("ErrorLog", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    route: {
      type: DataTypes.STRING(255),
    },
    method: {
      type: DataTypes.STRING(10),
    },
    context: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    payload: {
      type: DataTypes.JSON,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stack_trace: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "error_logs",
    timestamps: false,
    underscored: true,
  });

  return ErrorLog;
};