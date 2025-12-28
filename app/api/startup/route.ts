import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Startup from "@/database/startup.model";
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let startup;

        try {
            startup = Object.fromEntries(formData.entries());
        } catch {
            return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 })
        }

        const file = formData.get('image') as File;

        if (!file)
            return NextResponse.json({ message: 'Image file is reuired' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'startups' }, (error, results) => {
                if (error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        startup.image = (uploadResult as ({ secure_url: string })).secure_url;

        const createdStartup = await Startup.create(startup);

        return NextResponse.json({
            message: 'Event created successfully',
            startup: createdStartup
        },
            {
                status: 201
            })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Event Createion Failed', error: err instanceof Error ? err.message : 'Unknown' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const startups = await Startup.find();

        return NextResponse.json({ message: 'Start up fetched successfully', startups: startups }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Start up fetching failed', error: err instanceof Error ? err.message : 'Unknown' }, { status: 500 });
    }
}