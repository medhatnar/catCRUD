const express = require("express");
const db = require("../database/db");
const multer = require("multer");
const router = express.Router();

const multerStorage = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (_, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});
const upload = multer({
  storage: multerStorage,
});

// Cat API //

router.post("/cats", upload.single("pic"), async (req, res) => {
  const session = req.session;
  const catName = req.body.name;
  const picPath = req.file.path;

  const cat = await db.models.cat.create({
    name: catName,
    media: picPath,
    user_id: session.user_id,
  });

  res.send({ catName: cat.name, pic: cat.media, user: cat.user_id });
});

router.get("/cats", async (req, res) => {
  const cats = await db.models.cat.findAll();
  res.send(cats);
});

router.get("/cats/:id", () => {});

router.put("/cats/:id", () => {});

router.delete("/cats/:id", () => {});

module.exports = router;
