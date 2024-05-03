const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./dbConnection/dbConfig");
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
app.use(cors());
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

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Up and running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
