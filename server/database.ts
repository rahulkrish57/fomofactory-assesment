import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const database = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error("!!MongoDB URI is missing!!");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("::Database connection established::");
  } catch (error) {
    console.error("!!Database connection Failed!!", error);
  }
};

export default database;
