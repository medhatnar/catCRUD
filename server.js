// Modules //
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./database/db");
const authRoutes = require("./routes/auth");
const catRoutes = require("./routes/cat");
const cookieParser = require("cookie-parser");

// Initializations //;
const app = express();
const port = 3000;
const oneDayInMM = 86400000;
const corsOptions = {
  origin: "http://localhost:3000"
};

// Middleware //
db.sync();
app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(cookieParser());
app.use(
  session({
    secret: "737710n73cr3t",
    saveUninitialized: false,
    cookie: { maxAge: oneDayInMM },
    resave: true,
    rolling: true,
    name: "userId"
  })
);
app.use("/auth", authRoutes);
app.use("/api", catRoutes);

// Listeners //
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
