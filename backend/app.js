const connectDB = require("./dbConnection/dbConfig");
const app = require("./server");
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
