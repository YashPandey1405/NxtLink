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
    const { email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 },
      );
    }

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 },
      );
    }

    const tokens = await generateAccessAndRefereshTokens(existingUser._id);
    if (!tokens) {
      return NextResponse.json(
        { error: "Token generation failed" },
        { status: 500 },
      );
    }

    const { accessToken, refreshToken } = tokens;

    const loggedInUser = await User.findById(existingUser._id).select(
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
        message: "Login successful on NxtLink Platform",
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
      { error: "Failed to login user" },
      { status: 500 },
    );
  }
}
