// Modules //
const bcrypt = require("bcrypt");
const { attachSession, destroySession } = require("./sessionController");
const db = require("../database/db");
const User = db.models.user;

const Create = async ({ username, password }, type = "member") => {
  if (!username || !password)
    throw new Error("A username and password must be provided");
  if (type !== "member" && type !== "admin")
    throw Error(`${type} is an invalid user type`);

  const salt = await bcrypt.genSalt(10);
  // set user password to hashed password
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    password: hashedPassword,
    type,
  });

  return user;
};

const Login = async ({ username, password, session }) => {
  const user = await User.findOne({
    where: { username },
  });
  console.log(username, password, session)
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      await attachSession(session, user.id);
      return { status: 200, message: `${user.username} is now logged in.` };
    } else {
      const invalidPassword = new Error({
        message: "Invalid Password",
        status: 400,
      });
      throw invalidPassword;
    }
  } else {
    const userDoesNotExist = new Error({
      message: `User ${username} does not exist`,
      status: 401,
    });
    throw userDoesNotExist;
  }
};

const Logout = async ({session}) => {
  const user = await User.findOne({
    where: { id: session.userId },
  });
  destroySession(session, user.id);
};

const Destroy = async ({ id }) => {
  const deletedUser = await User.destroy({
    where: {
      id,
    },
  });

  return deletedUser;
};

module.exports = { Create, Login, Logout, Destroy };
