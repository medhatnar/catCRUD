import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: (...msg) => console.log(msg),
});

module.exports = {
  sequelize,
};
