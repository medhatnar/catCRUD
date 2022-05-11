// Modules //
const express = require("express");
const multer = require("multer");
const catController = require("../controllers/catController");

// Initializations //
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
// use call back for multer for validation
const upload = multer({
  storage: multerStorage,
});

// Cat API //
router.post("/cats", upload.single("media"), async (req, res) => {
  const session = req.session;
  const catName = req.body.name;
  const picPath = req.file.path;

  catController.Create({ session, catName, picPath });

  res.send({ catName: cat.name, media: cat.media, user: cat.userId });
});

router.get("/cats", async (_, res) => {
  const allCats = catController.Get();
  res.send(allCats);
});

router.get("/cats/users/:id", async (req, res) => {
  const userId = req.body.userId;
  catController.GetUsersCats({ session, catName, userId });
  res.send(cats);
});

router.get("/cats/:id", async (req, res) => {
  // check session to see session-user exists in this cat's listing
  const id = req.params.id;
  catController.GetOne({ id });
  res.send(cat);
});

router.put("/cats/:id", upload.single("media"), async (req, res) => {
  const params = req.params;
  const picPath = req.file.path;
  const body = req.body;

  catController.Update({ session, catName, picPath });

  res.send(updatedCat);
});

router.delete("/cats/:id", async (req, res) => {
  const id = req.params.id;
  catController.Delete({ session, catName, picPath });
  res.send(updatedCat);
});

module.exports = router;
