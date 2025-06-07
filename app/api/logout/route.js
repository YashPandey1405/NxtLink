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

export async function POST(request) {
  try {
    await connectToDatabase();

    console.log("1");
    const user = await verifyJWT(request);

    // Remove refreshToken from user in DB
    await User.findByIdAndUpdate(
      user._id,
      { $unset: { refreshToken: 1 } },
      { new: true },
    );

    // Prepare response and clear cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 },
    );

    // Clear cookies By Making The Access and Refresh Tokens Expired......
    response.cookies.set({
      name: "accessToken",
      value: "",
      httpOnly: true,
      secure: true,
      maxAge: 0,
      path: "/",
    });

    // Clear cookies By Making The Access and Refresh Tokens Expired......
    response.cookies.set({
      name: "refreshToken",
      value: "",
      httpOnly: true,
      secure: true,
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to Logout User" },
      { status: 500 },
    );
  }
}
