import mongoose from "mongoose";
import { Schema } from "mongoose";
import User from "@/models/User.models.js";

// Define the URL schema for storing shortened links and visit history
const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
      unique: true,
    },
    typeURL: {
      type: String,
      enum: ["Public", "Private"],
      default: "Private",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visitHistory: [
      {
        timestamp: {
          type: Number, // Use Date.now() to store timestamp
          required: true,
        },
      },
    ],
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
);

// Prevent model overwrite during development with hot reload
const Url = mongoose.models.url || mongoose.model("url", urlSchema);

// Export the model for use in routes or controllers
export default Url;
