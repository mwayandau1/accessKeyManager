const express = require("express");
const app = express();
require("dotenv").config();

const globalErrorHandler = require("./controllers/errorControllers");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const CustomError = require("./utils/customError");
const keyRoutes = require("./routes/keyRoutes");
app.use(helmet());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(morgan("tiny"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.set("trust proxy", true);

app.use("/auth", authRoutes);
app.use("/keys", keyRoutes);

app.get("/", (req, res) =>
  res.send("Welcome to Micro Focus token generation API")
);

app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
