import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.log("Failed connecting to MongoDB", error);
    process.exit(1);
  }
}
