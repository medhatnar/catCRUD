const { DataTypes } = require("sequelize");

module.exports = (db) => {
  const User = db.define("user", {
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  const Cat = db.define("cat", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return {
    User,
    Cat,
  };
};
