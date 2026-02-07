import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import VerificationToken from "@/app/models/VerificationToken";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the latest verification token for this email
    const token = await VerificationToken.findOne({
      email: email.toLowerCase().trim(),
      code,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > token.expiresAt) {
      // Clean up expired token
      await VerificationToken.deleteOne({ _id: token._id });
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Find and update user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Mark email as verified
    user.isEmailVerified = true;
    await user.save();

    // Clean up the verification token
    await VerificationToken.deleteOne({ _id: token._id });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
