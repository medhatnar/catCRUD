// Modules //
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./database/db");
const authRoutes = require("./routes/auth");
const catRoutes = require("./routes/cat");
const cookieParser = require("cookie-parser");

// Initializations //
const app = express();
const port = 3000;
const oneDayInMM = 86400000;

// Middleware //
// db.drop();
db.sync();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "737710n73cr3t",
    saveUninitialized: true,
    cookie: { maxAge: oneDayInMM },
    resave: false,
  })
);
app.use("/auth", authRoutes);
app.use("/api", catRoutes);

// Main page //

app.get("/", (_, res) => {
  res.sendFile("./client/index.html", { root: __dirname });
});

// Listeners //
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});