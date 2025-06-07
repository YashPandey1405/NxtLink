import { NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb.libs.js";
import User from "@/models/User.models.js";
import Url from "@/models/urls.models.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

export async function GET(request, { params }) {
  try {
    console.log("Entering GET request handler");
    await connectToDatabase();

    console.log("Connected to database successfully");
    // const { id } = params; // directly use params here
    const shortId = await params.id;

    console.log("Short ID to find:", shortId);
    console.log("1");
    // const user = await verifyJWT(request);

    console.log("3");
    console.log("Before fetching ShortID Objects");

    const ShortIDObject = await Url.findOne({
      shortId: shortId,
    }).populate("createdBy", "username fullname");

    console.log("ShortID Object fetched:", ShortIDObject);
    console.log("After fetching ShortID Objects");

    if (!ShortIDObject) {
      return NextResponse.json({ error: "ShortID not found" }, { status: 404 });
    }

    console.log("Before updating visitHistory");
    // Push current timestamp to visitHistory array
    const updatedObject = await Url.findByIdAndUpdate(
      ShortIDObject._id,
      { $push: { visitHistory: { timestamp: new Date() } } },
      { new: true }, // optional: returns the updated document
    );
    console.log("After updating visitHistory");

    // Extract and fix URL if needed
    let originalURL = ShortIDObject.redirectURL;
    if (
      !originalURL.startsWith("http://") &&
      !originalURL.startsWith("https://")
    ) {
      originalURL = "https://" + originalURL; // Auto-fix missing protocol
    }

    console.log(`Redirecting to: ${originalURL}`);
    return NextResponse.redirect(originalURL);
    // const response = NextResponse.json(
    //   {
    //     success: true,
    //     message: "Redirecting To Orignal URL",
    //     originalURL: originalURL,
    //   },
    //   { status: 200 },
    // );
    // return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to return ShortID Objects" },
      { status: 500 },
    );
  }
}
