// Modules //
const path = require("path");
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
    cb(null, `${Date.now()}.${ext}`);
  },
});
// use call back for multer for validation
const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return new Error("Unsupported Media Type");
    }
  },
});

// Cat API //
router.post("/cats", upload.single("media"), (req, res) => {
  const session = req.session;
  const name = req.body.name;
  const file = req.file;

  if (!file) {
    res.status(415).json({ message: "Only Cat image files are allowed!" });
  } else {
    const cat = Create({ session, name, picPath: file.path });

    cat
      .then((cat) => {
        res.status(200).sendFile(path.resolve(cat.media));
      })
      .catch((error) => {
        res.status(401).json({
          message: "You can NOT post Cat pics without logging in first!",
        });
        console.error(error);
      });
  }
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
      } else {
        console.error(error);
        res.json(error);
      }
    });
});

router.get("/cats/:id", (req, res) => {
  const id = req.params.id;
  const session = req.session;

  const cat = GetOne({ id, session });

  cat
    .then((cat) => {
      res.status(200).sendFile(path.resolve(cat.media));
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
      } else {
        console.error(error);
        res.json(error);
      }
    });
});

router.put("/cats/:id", upload.single("media"), (req, res) => {
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
      } else {
        console.error(error);
        res.json(error);
      }
    });
});

router.delete("/cats/:id", async (req, res) => {
  const id = req.params.id;
  const session = req.session;
  const deletedCat = Delete({ id, session });

  deletedCat
    .then((_) => {
      res.status(200).send("Cat Deleted");
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
        console.error(error);
        res.status(404).json({
          message: "Cat not found.",
        });
      }
    });
});

module.exports = router;
