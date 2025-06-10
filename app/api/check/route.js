// File To Check Whether The User is Authenticated or Not......

import { NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb.libs.js";
import User from "@/models/User.models.js";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // Connect To The Database.....
    await connectToDatabase();

    console.log("1");

    // 1. Get token from Authorization header or cookie
    const authHeader = request.headers.get("authorization");
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    console.log("2");
    const tokenFromCookie = request.cookies.get("accessToken")?.value;
    const token = tokenFromCookie || bearerToken;

    // 2. Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken);

    console.log("3");
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Authenticated",
        },
        { status: 401 },
      );
    }

    console.log("4");
    // 3. Fetch user from DB by ID in token payload
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    console.log("5");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Authenticated",
        },
        { status: 401 },
      );
    }

    console.log("6");
    return NextResponse.json(
      {
        success: true,
        message: "User Is Authenticated",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check Authentication Of User" },
      { status: 500 },
    );
  }
}
