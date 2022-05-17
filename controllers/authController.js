// Modules //
const bcrypt = require("bcrypt");
const { attachSession, destroySession } = require("./sessionController");
const db = require("../database/db");
const User = db.models.user;

const Create = async ({ username, password }) => {
  if (!username || !password)
    throw new Error("A username and password must be provided");

  const userExists = await User.findOne({
    where: { username },
  });

  if (userExists) throw new Error(`${username} already exists. Please Login.`);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    password: hashedPassword,
  });

  return user;
};

const Login = async ({ session, username, password }) => {
  const user = await User.findOne({
    where: { username },
  });

  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      await attachSession({ session, userId: user.id });
      return { status: 200, message: `${user.username} is now logged in.` };
    } else {
      const invalidPassword = new Error("400");
      throw invalidPassword;
    }
  } else {
    const userDoesNotExist = new Error("401");
    throw userDoesNotExist;
  }
};

const Logout = ({ session }) => {
  destroySession({ session });
};

const Destroy = async ({ username }) => {
  const deletedUser = await User.destroy({
    where: {
      username,
    },
  });

  return deletedUser;
};

module.exports = { Create, Login, Logout, Destroy };
