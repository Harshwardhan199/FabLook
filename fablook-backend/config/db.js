const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_ATLAS_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB Atlas with Mongoose!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
