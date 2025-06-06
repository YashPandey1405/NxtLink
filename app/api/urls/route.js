import { NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb.libs.js";
import User from "@/models/User.models.js";
import Url from "@/models/urls.models.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

async function verifyJWT(request) {
  try {
    // 1. Get token from Authorization header or cookie
    const authHeader = request.headers.get("authorization");
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    const tokenFromCookie = request.cookies.get("accessToken")?.value;
    const token = tokenFromCookie || bearerToken;

    if (!token) {
      throw new Error("Unauthorized request: No token found");
    }

    // 2. Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Fetch user from DB by ID in token payload
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new Error("Invalid Access Token: User not found");
    }

    console.log(user);
    return user; // return user info if verified successfully
  } catch (error) {
    console.error("JWT verification error:", error);
    throw new Error("Authentication failed");
  }
}

export async function GET(request) {
  try {
    // Connect To The Database.....
    await connectToDatabase();

    const user = await verifyJWT(request);

    const allShortIDs = await Url.find({
      $or: [{ createdBy: user._id }, { typeURL: "Public" }],
    }).populate("createdBy", "username fullname");

    // Return all ShortID Objects.....
    return NextResponse.json(allShortIDs, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to return ShortID Objects" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    // Connect To The Database.....
    await connectToDatabase();

    const user = await verifyJWT(request);

    const body = await request.json();
    const { originalUrl, typeURL } = body;

    // When The Original URL is not provided, return an error.......
    if (!originalUrl) {
      return NextResponse.json(
        { error: "Original URL is required" },
        { status: 400 },
      );
    }

    const shortID = nanoid(8);

    const newCreatedShortURL = await Url.create({
      shortId: shortID,
      redirectURL: originalUrl,
      typeURL: typeURL || "Private", // Default to Private if not provided
      createdBy: new mongoose.Types.ObjectId(user._id),
      visitHistory: [],
    });

    return NextResponse.json(newCreatedShortURL, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create ShortID" },
      { status: 500 },
    );
  }
}
