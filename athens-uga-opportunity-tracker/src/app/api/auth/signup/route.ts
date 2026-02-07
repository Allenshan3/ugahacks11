import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

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

    // Create new user / sign up
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || "student",
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        message: "User created successfully",
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

