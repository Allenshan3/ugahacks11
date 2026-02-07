import connectMongoDB from "../../lib/mongodb";
import Job from "../../models/itemSchema"; 
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

// POST - Create a new job
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    await connectMongoDB();
    
    const created = await Job.create({
      ...body,
      userId: session.user.email, 
    });

    return NextResponse.json(
      { message: "Job added successfully", job: created },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

// GET - Get all jobs for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();
    
    // Only get jobs that belong to this user by checking userId
    const jobs = await Job.find({ userId: session.user.email }).sort({ createdAt: -1 });
    
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}