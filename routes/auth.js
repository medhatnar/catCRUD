const express = require("express");
const router = express.Router();
const { Create, Login, Logout } = require("../controllers/authController");

// signup route //
router.post("/register", (req, res) => {
  const password = req.body.password;
  const username = req.body.username;

  const user = Create({ username, password });

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
router.post("/login", (req, res) => {
  const session = req.session;
  const username = req.body.username;
  const password = req.body.password;

  const attemptLogin = Login({ username, password, session });

  attemptLogin
    .then((success) => {
      res.status(success.status).json({ message: success.message });
    })
    .catch((error) => {
      const errorJSON = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (errorJSON.message === "400") {
        res.status(400).json({ message: "Invalid Password" });
      } else if (errorJSON.message === "401") {
        res.status(401).json({ message: `User ${username} does not exist` });
      }
    });
});

// logout route //
router.post("/logout", (req, res) => {
  const session = req.session;

  Logout({session});
  res.json({ message: "You have succcessfully logged out." });
});

module.exports = router;
