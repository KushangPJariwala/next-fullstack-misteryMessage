import mongoose from "mongoose";

type connObj = {
  isConnected?: number;
};

const connection: connObj = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("db already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;

    console.log("db connected");
  } catch (err) {
    console.log("db connection failed ::: ",err)
    process.exit(1)
  }
}
