// Modules //
const bcrypt = require("bcrypt");
const {
  attachSession,
  destroySession,
} = require("./sessionController");
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

const Login = async ({username, password, session}) => {
  const user = await User.findOne({
    where: { username },
  });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      await attachSession(session, user.id);
      return { message: `${user.username} is now logged in` };
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
};

const Logout = async (session, userId) => {
  const user = await User.findOne({
    where: { username: body.username },
  });
  destroySession(req.session, req.session.user_id);
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
