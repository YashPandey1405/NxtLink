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
    console.log("GET request received with params:", params);
    console.log("Entering GET request handler");
    await connectToDatabase();

    const user = await verifyJWT(request);

    console.log("Connected to database successfully");
    // const { id } = params; // directly use params here
    const ObjectID = await params.id;

    console.log("Short ID to find:", ObjectID);
    console.log("1");
    // const user = await verifyJWT(request);

    console.log("3");
    console.log("Before fetching ObjectID Objects");

    const requestedObject = await Url.findById(ObjectID);

    console.log("ShortID Object fetched:", requestedObject);
    console.log("After fetching ShortID Objects");

    if (!requestedObject) {
      return NextResponse.json({ error: "ShortID not found" }, { status: 404 });
    }

    console.log("Sending response ");
    const response = NextResponse.json(
      {
        data: requestedObject,
        success: true,
        message: "Redirecting To Original URL",
      },
      { status: 200 },
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to return ShortID Objects" },
      { status: 500 },
    );
  }
}
