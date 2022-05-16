const Sequelize = require("sequelize");
const models = require("./models");

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

models(sequelize);

function applyAssociations(db) {
	const { user, cat, session } = db.models;

	user.hasMany(cat);
	cat.belongsTo(user);
  user.hasOne(session);
  session.belongsTo(user);

  return db;
}

const db = applyAssociations(sequelize);

module.exports = db;
