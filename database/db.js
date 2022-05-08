const Sequelize = require("sequelize");
const models = require("./models");

const db = new Sequelize("catabase", "admin", "obUyPuF3ddB8B8Hp1gfm", {
  dialect: "mysql",
  host: "catabase-1.cgocc8slqpnw.us-east-1.rds.amazonaws.com",
  port: 3306,
});

models(db);

module.exports = db;
