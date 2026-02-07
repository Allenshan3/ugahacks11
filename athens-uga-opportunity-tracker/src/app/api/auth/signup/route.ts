import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import VerificationToken from "@/app/models/VerificationToken";
import { sendVerificationEmail } from "@/app/lib/email";

// Helper to generate 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validation of user
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists in DB
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate verification code (valid for 24 hours)
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || "student",
      isEmailVerified: false,
    });

    // Store verification token
    await VerificationToken.create({
      email: user.email,
      code: verificationCode,
      expiresAt,
    });

    // Send verification email
    let emailSent = false;
    try {
      const result = await sendVerificationEmail(
        user.email,
        verificationCode,
        user.name
      );
      emailSent = result.success;
    } catch (emailError) {
      console.error("Email sending threw error:", emailError);
    }

    if (!emailSent) {
      console.error(
        `Verification email failed for ${user.email}. User created but needs to request resend.`
      );
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email for a verification code.",
        email: user.email,
        verificationEmailSent: emailSent,
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user. Please try again." },
      { status: 500 }
    );
  }
}