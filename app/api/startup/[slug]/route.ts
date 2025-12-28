import Startup from "@/database/startup.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
    params: Promise<{
        slug: string;
    }>
};

export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
    try {
        await connectDB();

        const { slug } = await params;

        if (!slug || typeof slug !== 'string' || slug.trim() === '') {
            return NextResponse.json(
                { message: 'Invalid or missing slug parameter' },
                { status: 400 }
            );
        }

        const startup = Startup.findOne({ slug: slug.trim().toLowerCase() }).lean();

        if (!startup)
            return NextResponse.json(
                { message: `Start up with slug ${slug.trim().toLowerCase()} not found` },
                { status: 404 }
            );

        return NextResponse.json(
            { message: 'Start up fetched successfully', startup: startup },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ message: 'Start up not found', error: err instanceof Error ? err.message : 'Unknown' }, { status: 500 });
    }
}