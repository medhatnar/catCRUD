const { DataTypes } = require('sequelize');

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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  const Cat = db.define("cat", {
    name: {
      type: DataTypes.STRING,
    },
    media: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
    },
  });

  const Session = db.define("session", {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return {
    User,
    Cat,
    Session
  }
};
