// Modules //
const express = require("express");
const multer = require("multer");
const {
  Create,
  Get,
  GetUsersCats,
  GetOne,
  Update,
  Delete,
} = require("../controllers/catController");

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
router.post("/cats", upload.single("media"), (req, res) => {
  const session = req.session;
  const name = req.body.name;
  const picPath = req.file.path;

  const cat = Create({ session, name, picPath });

  cat
    .then((cat) => {
      res
        .status(200)
        .json({ name: cat.name, media: cat.media, user: cat.userId });
    })
    .catch((_) => {
      res.status(401).json({
        message: "You can not post Cat pics without logging in first!",
      });
    });
});

router.get("/cats", async (_, res) => {
  const allCats = await Get();

  res.status(200).json(allCats);
});

router.get("/cats/users/:id", (req, res) => {
  const userId = req.params.id;
  const session = req.session;

  const cats = GetUsersCats({ session, userId });

  cats
    .then((cats) => {
      res.status(200).json(cats);
    })
    .catch((error) => {
      const errorJSON = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (errorJSON.message === "403") {
        res.status(403).json({
          message: "You are NOT authorized to view these Cats!",
        });
      } else if (errorJSON.message === "404") {
        res.status(404).json({
          message: "Cats not found...",
        });
      }
    });
});

router.get("/cats/:id", async (req, res) => {
  const id = req.params.id;
  const session = req.session;

  const cat = GetOne({ id, session });

  cat
    .then((cat) => {
      res
        .status(200)
        .json({ id: cat.id, name: cat.name, media: cat.media, user: cat.userId });
    })
    .catch((error) => {
      const errorJSON = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (errorJSON.message === "403") {
        res.status(403).json({
          message: "You are NOT authorized to view this Cat!",
        });
      } else if (errorJSON.message === "404") {
        res.status(404).json({
          message: "Cat not found.",
        });
      }
    });
});

router.put("/cats/:id", upload.single("media"), async (req, res) => {
  const id = req.params.id;
  const picPath = req.file.path;
  const session = req.session;
  const payload = req.body;

  const updatedCat = Update({ id, picPath, session, payload });

  updatedCat
    .then((cat) => {
      res
        .status(200)
        .json({ name: cat.name, media: cat.media, user: cat.userId });
    })
    .catch((error) => {
      const errorJSON = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (errorJSON.message === "403") {
        res.status(403).json({
          message: "You are NOT authorized to update this cat.",
        });
      } else if (errorJSON.message === "404") {
        res.status(404).json({
          message: "Cat not found.",
        });
      }
    });
});

router.delete("/cats/:id", async (req, res) => {
  const id = req.params.id;
  const session = req.session;
  const deletedCat = Delete({ id, session });

  deletedCat
    .then((_) => {
      res
        .status(200)
        .send("Cat Deleted");
    })
    .catch((error) => {
      const errorJSON = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (errorJSON.message === "403") {
        res.status(403).json({
          message: "You are NOT authorized to delete this cat.",
        });
      } else {
        res.status(404).json({
          message: "Cat not found.",
        });
      }
    });
});

module.exports = router;
