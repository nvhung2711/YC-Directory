import mongoose from "mongoose";
import Startup from "@/database/startup.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
    params: Promise<{
        id: string;
    }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid author id" }, { status: 400 });
        }

        const authorObjectId = new mongoose.Types.ObjectId(id);

        const startups = await Startup.find({ authorId: authorObjectId }).lean();

        return NextResponse.json(
            { message: "Startups by author fetched successfully", startups },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            {
                message: "Fetching startups by author failed",
                error: err instanceof Error ? err.message : "Unknown",
            },
            { status: 500 }
        );
    }
}