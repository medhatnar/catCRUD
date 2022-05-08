require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database/db");

// Initializations
const app = express();
const port = 3000;

// Middleware
db.drop();
db.sync();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: 'uploads/' });
// Main page

app.get("/", (_, res) => {
  res.sendFile("./client/index.html", { root: __dirname });
});

// Cat API //

app.post("/cats", upload.single("pic"), (req, res) => {
  const catName = req.body.name;
  const key = req.file.key;
  res.send({ catPic: signedUrl });
  const cat = db.models.cat.create({
    name: catName,
    media: location,
  });

  // res.send(image);
});

app.get("/cats", async (req, res) => {
  const cats = await db.models.cat.findAll();
  res.send(cats);
});

app.get("/cats/:id", () => {});

app.put("/cats/:id", () => {});

app.delete("/cats/:id", () => {});

// User API //

app.post("/register", (req, res) => {
  const cat = db.models.user.create({
    username: "name",
    media: "S3 link",
    user_id: "User.id",
  });
});

app.post("/login", (req, res) => {});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
