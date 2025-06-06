import mongoose from "mongoose";

// Check if the MongoDB URI is provided in the environment variables
if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

/**
 * 🔁 Global cache to store the connection object
 * This prevents multiple connections being created during hot reloads
 * in Next.js development mode.
 */
let cached = global.mongoose;

if (!cached) {
  // If no cache exists yet, initialize it
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * 📦 connectToDatabase
 * Handles connection to MongoDB using mongoose with caching.
 * Reuses the connection on every API call instead of opening new ones.
 */
async function connectToDatabase() {
  // If already connected, return the existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection is in progress, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose's internal buffering
    };

    // Start new connection and cache the promise
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    // Await the connection and store it
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise for future attempts
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Export the connection utility for use in API routes and server logic
export default connectToDatabase;
