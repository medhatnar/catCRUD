const Sequelize = require("sequelize");
const models = require("./models");
const config = require("./db.config.js");

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'uploads/database.sqlite'
});

models(db);

module.exports = db;
