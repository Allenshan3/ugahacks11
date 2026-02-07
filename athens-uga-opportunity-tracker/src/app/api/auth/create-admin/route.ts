import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function POST(request: Request) {
  try {
    const adminSecret = process.env.ADMIN_CREATION_SECRET;
    if (adminSecret) {
      const { secret } = await request.json().catch(() => ({}));
      if (secret !== adminSecret) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please provide name, email, and password" },
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

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      existingUser.role = "admin";
      await existingUser.save();
      return NextResponse.json(
        {
          message: "User already exists. Role updated to admin.",
          user: {
            id: existingUser._id.toString(),
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
          },
        },
        { status: 200 }
      );
    }

    
    const adminUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "admin",
    });

    const { password: _, ...userWithoutPassword } = adminUser.toObject();

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Admin creation error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user. Please try again." },
      { status: 500 }
    );
  }
}

