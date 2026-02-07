import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import VerificationToken from "@/app/models/VerificationToken";
import { sendVerificationEmail } from "@/app/lib/email";

// Helper to generate 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Rate limiting: Check if user has requested a code in the last 60 seconds
    const recentToken = await VerificationToken.findOne({
      email: email.toLowerCase().trim(),
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    });

    if (recentToken) {
      return NextResponse.json(
        { error: "Please wait 60 seconds before requesting another code" },
        { status: 429 }
      );
    }

    // Delete old tokens for this email
    await VerificationToken.deleteMany({
      email: email.toLowerCase().trim(),
    });

    // Generate new code (valid for 24 hours)
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store token
    await VerificationToken.create({
      email: email.toLowerCase().trim(),
      code,
      expiresAt,
    });

    // Send email
    const result = await sendVerificationEmail(
      email,
      code,
      "User" // You can fetch the actual name if needed
    );

    if (!result.success) {
      // Log error but don't fail the request - user can try resend
      console.error(`Failed to send verification email to ${email}:`, result.error);
      return NextResponse.json(
        {
          message: "Code generated but email failed to send. Please try again.",
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification code sent to your email" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification code. Please try again." },
      { status: 500 }
    );
  }
}
