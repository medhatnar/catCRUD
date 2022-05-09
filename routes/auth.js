const bcrypt = require("bcrypt");
const express = require("express");
const db = require("../database/db");

const router = express.Router();

function attachSession(session, userId) {
  db.models.session.create({
    user_id: userId,
    expires_at: session.cookie._expires,
  });
  session.user_id = userId;
}

function destroySession(session, userId) {
  session.destroy();
  db.models.session.destroy({
    where: {
      user_id: userId,
    },
  });
}

// signup route //
router.post("/register", async (req, res) => {
  const body = req.query;
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  const password = await bcrypt.hash(body.password, salt);

  const user = await db.models.user.create({
    username: body.username,
    password,
    type: "member", // user type can only be changed via database
  });

  res.status(201).json({ message: `${user.username} created` });
});

// login route //
router.post("/login", async (req, res) => {
  const session = req.session;
  const body = req.query;
  const user = await db.models.user.findOne({
    where: { username: body.username },
  });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      attachSession(session, user.id);
      res.status(200).json({ message: "Valid password" });
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});

router.get("/logout", (req, res) => {
  destroySession(req.session, req.session.user_id);
  res.redirect("/");
});

module.exports = router;
