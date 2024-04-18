const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./dbConnection/dbConfig");
const morgan = require("morgan");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use("/auth", authRoutes);

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
