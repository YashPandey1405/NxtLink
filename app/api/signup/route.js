import { cookies } from "next/headers";
import { serialize } from "cookie";
import { NextResponse } from "next/server";
import connectToDatabase from "@/libs/mongodb.libs.js";
import User from "@/models/User.models.js";

// Common Method To Generate Access And Refresh Tokens
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return null; // caller will handle response
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, username, fullname, password } = body;
    console.log("Received signup request:", body);

    // Validate required fields
    if (!email || !username || !password || !fullname) {
      return NextResponse.json(
        { error: "Email, fullname, username, and password are required" },
        { status: 400 },
      );
    }
    console.log("Validating user input...");

    // Connect to the database
    await connectToDatabase();
    console.log("Connected to the database successfully");

    // Check if user already exists with the same email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    console.log("Checking for existing user...");
    // If user already exists, return an error
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email or username" },
        { status: 400 },
      );
    }

    console.log("Creating new user...");
    // Creates a new User document & Saves it to your MongoDB database.
    // await newUser.save(); --> No need as it's already saved in the create method
    const newUser = await User.create({
      email: email,
      username: username,
      fullname: fullname,
      password: password,
    });

    // If the user is not created, throw an error.....
    if (!newUser) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 },
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      newUser._id,
    );

    // Get Above Created user info without password & refreshToken
    const loggedInUser = await User.findById(newUser._id).select(
      "-password -refreshToken",
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    // ✅ First create the response
    const response = NextResponse.json(
      {
        success: true,
        message: "Signup successful on NxtLink Platform",
        user: loggedInUser,
      },
      { status: 200 },
    );

    // ✅ Set cookies on the response directly
    response.cookies.set("accessToken", accessToken, cookieOptions);
    response.cookies.set("refreshToken", refreshToken, cookieOptions);

    // ✅ Return the response with cookies
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to signup user" },
      { status: 500 },
    );
  }
}
