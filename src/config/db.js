import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const connectDB = async (uri, name) => {
  try {
    await mongoose.connect(uri, {
      dbName: name,
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
