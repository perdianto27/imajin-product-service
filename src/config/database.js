const { Sequelize } = require("sequelize");
const pg = require("pg");

const DB_HOST = process.env.PGHOST || "localhost";
const DB_PORT = process.env.PGPORT || 5432;
const DB_NAME = process.env.PGDATABASE;
const DB_USER = process.env.PGUSER;
const DB_PASS = process.env.PGPASSWORD;
console.log('db_host: ' + DB_HOST);
console.log('db_port: ' + DB_PORT);
console.log('db_name: ' + DB_NAME);
console.log('db_user: ' + DB_USER);
console.log('db_pass: ' + DB_PASS);

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
  }
};

testConnection();

module.exports = sequelize;