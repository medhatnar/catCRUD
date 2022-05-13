const Sequelize = require("sequelize");
const models = require("./models");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

models(sequelize);

function applyAssociations(db) {
  const { user, cat } = db.models;

  user.hasMany(cat);
  cat.belongsTo(user);

  return db;
}

const db = applyAssociations(sequelize);

module.exports = db;
