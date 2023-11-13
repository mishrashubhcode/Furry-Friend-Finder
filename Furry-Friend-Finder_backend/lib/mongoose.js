const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_DB_URL } = process.env;

const db = mongoose.connection;
mongoose.set('strictQuery', true);

db.on("error", (err) => {
  console.log("ERROR", err);
});
db.once("open", () => {
  console.log("mongoose is connected");
});

mongoose.connect(MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Mongoose is connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
