// Modules //
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cors = require("cors");
const db = require("./database/db");
const authRoutes = require("./routes/auth");
const catRoutes = require("./routes/cat");
const removeUploadedFiles = require("multer/lib/remove-uploaded-files");

// Initializations //;
const app = express();
const port = 3000;
const corsOptions = {
  origin: "http://localhost:3000",
};
// session expires in 1 hour
const sessionStore = new SequelizeStore({
  db: db,
  expiration: 3600000,
});

// Middleware //
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);
app.use(cookieParser());
app.use(
  session({
    name: "sid",
    proxy: true,
    resave: false,
    saveUninitialized: false,
    secret: "73cr3t",
    store: sessionStore,
  })
);

db.sync();
sessionStore.sync();

// Routes
app.use("/auth", authRoutes);
app.use("/api", catRoutes);

// Listeners //
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
