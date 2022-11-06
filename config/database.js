const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
// const DB = process.env.DATABASE_LOCAL
// const DB = process.env.DATABSE_LOCAL_TEST.replace(
  "<PASSWORD>",
  process.env.PASSWORD
);

const connectionToMongoDB = () => {
  mongoose.connect(DB);
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB successfully...");
  });
  mongoose.connection.on("error", (err) => {
    console.log("An error occurred connecting to MongoDB...");
    console.log(err);
  });
};

module.exports = connectionToMongoDB;
