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
  const username = req.body.username;
  const password = req.body.password;
  console.log(session, 'LOGIN STUFF', username, password)
  const attemptLogin = Login({ username, password, session });

  attemptLogin
    .then((success) => {
      res.status(success.status).json({ message: success.message });
    })
    .catch((error) => {
      const errorJSON = JSON.stringify(error, Object.getOwnPropertyNames(error))
      console.error(errorJSON.stack);
      res
        .status({ status: errorJSON.status })
        .send({ error: errorJSON.message });
    });
});

router.get("/logout", (req, res) => {
  destroySession(req.session, req.session.user_id);
  res.redirect("/");
});

module.exports = router;
