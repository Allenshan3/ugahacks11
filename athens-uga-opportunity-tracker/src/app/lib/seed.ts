/**
 * Database seeding script
 * Run this to create initial demo users in your MongoDB database
 * 
 * Usage: Add this to a script in package.json or run directly with ts-node
 */

import connectDB from "./mongodb";
import User from "../models/User";

async function seedDatabase() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Check if users already exist
    const existingUsers = await User.find({
      email: {
        $in: [
          process.env.NEXTAUTH_DEMO_EMAIL || "student1@uga.edu",
          process.env.NEXTAUTH_ADMIN_EMAIL || "admin@uga.edu",
        ],
      },
    });

    if (existingUsers.length > 0) {
      console.log("Demo users already exist. Skipping seed.");
      process.exit(0);
    }

    // Create demo student user
    const studentEmail = process.env.NEXTAUTH_DEMO_EMAIL || "student1@uga.edu";
    const studentPassword = process.env.NEXTAUTH_DEMO_PASSWORD || "test123!";
    
    const student = await User.create({
      name: "Demo Student",
      email: studentEmail,
      password: studentPassword,
      role: "student",
    });

    console.log(`Created student user: ${student.email}`);

    // Create demo admin user
    const adminEmail = process.env.NEXTAUTH_ADMIN_EMAIL || "admin@uga.edu";
    const adminPassword = process.env.NEXTAUTH_ADMIN_PASSWORD || "admin123!";
    
    const admin = await User.create({
      name: "Career Coach",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log(`Created admin user: ${admin.email}`);
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;

