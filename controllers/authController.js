// Modules //
const bcrypt = require("bcrypt");
const sessionController = require("../controllers/sessionController");
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

const Login = async (username, password) => {
  const user = await User.findOne({
    where: { username },
  });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      attachSession(session, user.id);
      res.status(200).json({ message: "Valid password" });
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

module.exports = { Create, Login, Logout };
