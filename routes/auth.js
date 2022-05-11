const express = require("express");
const router = express.Router();
const { Create, Login, Logout } = require("../controllers/authController");

// signup route //
router.post("/register", (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  const type = req.body.type;

  const user = Create({ username, password }, type);

  user
    .then((result) => res.status(201).send(`${result.username} created!`))
    .catch((error) => {
      const errorJSON = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      console.error(errorJSON.stack);
      res.status(422).send({ error: errorJSON.message });
    });
});

// login route //
router.post("/login", async (req, res) => {
  const session = req.session;
  const username = req.query.body.username;
  const password = req.query.body.password;
  res.status(200).json({ message: "Valid password" });
  res.status(400).json({ error: "Invalid Password" });
  res.status(401).json({ error: "User does not exist" });
});

router.get("/logout", (req, res) => {
  destroySession(req.session, req.session.user_id);
  res.redirect("/");
});

module.exports = router;
