require("dotenv").config();
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const cors = require("cors");
const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");
const db = require("./database/db");

// Initializations
const app = express();
const port = 3000;
const s3 = new AWS.S3({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET,
  region: "us-east-1",
  signatureVersion: "v4",
});

// Middleware
db.drop();
db.sync();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "codecatemy",
    metadata: function (_, file, cb) {
      cb(null, { fieldName: file.originalname, mimetype: file.mimetype });
    },
    key: function (_, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});
// Main page

app.get("/", (_, res) => {
  res.sendFile("./client/index.html", { root: __dirname });
});

// Cat API //

app.post("/cats", upload.single("pic"), (req, res) => {
  const catName = req.body.name;
  const key = req.file.key;
  const signedUrl = s3.getSignedUrl("getObject", {
    Key: req.file.key,
    Bucket: "codecatemy",
    Expires: 43200
  });
  res.send({catPic: signedUrl});
  const cat = db.models.cat.create({
    name: catName,
    media: location
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
