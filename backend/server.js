const express = require("express");
const app = express();
require("dotenv").config();

const globalErrorHandler = require("./controllers/errorControllers");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const CustomError = require("./utils/customError");
const keyRoutes = require("./routes/keyRoutes");
app.use(helmet());
app.use(express.json());

app.use(morgan("tiny"));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://accesskeymanager.onrender.com"],
  })
);
app.set("trust proxy", true);

app.get("/", (req, res) =>
  res.send("Welcome to Micro Focus token generation API")
);

app.use("/auth", authRoutes);
app.use("/keys", keyRoutes);

app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
