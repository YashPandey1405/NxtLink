// File To Check Whether The User is Authenticated or Not......

import { NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb.libs.js";
import User from "@/models/User.models.js";

export async function GET(request) {
  try {
    // Connect To The Database.....
    await connectToDatabase();

    // 1. Get token from Authorization header or cookie
    const authHeader = request.headers.get("authorization");
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    const tokenFromCookie = request.cookies.get("accessToken")?.value;
    const token = tokenFromCookie || bearerToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Authenticated",
        },
        { status: 401 },
      );
    }

    // 3. Fetch user from DB by ID in token payload
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Authenticated",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User Not Authenticated",
      },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check Authentication Of User" },
      { status: 500 },
    );
  }
}
