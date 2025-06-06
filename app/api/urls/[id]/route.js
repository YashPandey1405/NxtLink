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
    await connectToDatabase();

    const { id } = params; // directly use params here

    console.log("1");
    const user = await verifyJWT(request);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    console.log("3");
    console.log("Before fetching ShortID Objects");
    const allShortIDs = await Url.findById(id).populate(
      "createdBy",
      "username fullname",
    );

    console.log("After fetching ShortID Objects");

    if (!allShortIDs) {
      return NextResponse.json({ error: "ShortID not found" }, { status: 404 });
    }

    return NextResponse.json(allShortIDs, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to return ShortID Objects" },
      { status: 500 },
    );
  }
}
