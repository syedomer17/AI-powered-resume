import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// Reuse connection in dev to avoid multiple connections
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        const conn = await mongoose.connect(MONGODB_URI, {
          bufferCommands: false,
        });
        return conn;
      } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
      }
    })();
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
