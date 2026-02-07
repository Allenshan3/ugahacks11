import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import connectMongoDB from "../../../../../lib/mongodb";
import Job from "../../../models/itemSchema";

export const dynamic = "force-dynamic";

type RouteParams = {
    params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
    const { id } = await params;
    await connectMongoDB();
    const item = await Job.findOne({ _id: id});

    if (!item) {
        return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ item }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const body = await request.json();
    
    await connectMongoDB();
    
    
    const updatedJob = await Job.findByIdAndUpdate(
        id, 
        body,  
        { new: true, runValidators: true }  
    );

    if (!updatedJob) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    
    return NextResponse.json({ 
        message: "Job updated successfully", 
        job: updatedJob  
    }, { status: 200 });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return  NextResponse.json({ message: "Invalid item ID" }, { status: 400 });
    }

    await connectMongoDB();
    const deletedItem = await Job.findByIdAndDelete(id);
    
    if (!deletedItem) {
        return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Item deleted" }, { status: 200 });
}
