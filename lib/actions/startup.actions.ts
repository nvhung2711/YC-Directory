"use server";

import mongoose from "mongoose";

import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Startup, { IStartup } from "@/database/startup.model";

export type StartupResult = { status: "SUCCESS"; startups: IStartup[] } | { status: "SUCCESS"; startup: IStartup } | { status: "ERROR"; error: string } | { status: "NOT FOUND"; startups: [] };

// Make sure Cloudinary is configured somewhere (env vars)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function createStartupAction(
    formData: FormData
): Promise<StartupResult> {
    try {
        await connectDB();

        // 1) Extract basic fields from the form
        const title = (formData.get("title") as string)?.trim();
        const description = (formData.get("description") as string)?.trim();
        const category = (formData.get("category") as string)?.trim();
        const pitch = (formData.get("pitch") as string)?.trim();
        const imageFile = formData.get("image") as File | null;

        if (!title || !description || !category || !pitch) {
            return { status: "ERROR", error: "Missing required fields" };
        }

        if (!imageFile || !(imageFile instanceof File)) {
            return { status: "ERROR", error: "Image file is required" };
        }

        // 2) Convert File -> Buffer for Cloudinary
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3) Upload to Cloudinary
        const uploadResult = await new Promise<{
            secure_url: string;
        }>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { resource_type: "image", folder: "startups" },
                    (error, result) => {
                        if (error || !result) return reject(error || new Error("Upload failed"));
                        resolve({ secure_url: result.secure_url });
                    }
                )
                .end(buffer);
        });

        // 4) Create startup document in MongoDB
        const createdStartup = await Startup.create({
            title,
            description,
            category,
            pitch,
            image: uploadResult.secure_url,
        });

        return { status: "SUCCESS", startup: createdStartup as IStartup };
    } catch (err) {
        console.error("createStartupAction error:", err);
        return {
            status: "ERROR",
            error:
                err instanceof Error ? err.message : "An unexpected error occurred while creating startup",
        };
    }
}

export const getStartups = async () => {
    try {
        await connectDB();

        const startups = await Startup.find();

        if (!startups)
            return { status: "NOT FOUND", startups: [] }

        return { status: "SUCCESS", startups: startups }
    } catch (err) {
        return { status: "ERROR", error: err instanceof Error ? err.message : 'Unknown' }
    }
}

export const getStartupsByAuthor = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { status: "NOT FOUND", startups: [] }
    }

    try {
        await connectDB();

        const startups = await Startup.find({ authorId: new mongoose.Types.ObjectId(id) });

        if (!startups)
            return { status: "NOT FOUND", startups: [] }

        return { status: "SUCCESS", startups: startups };
    } catch (err) {
        return { status: "ERROR", error: err instanceof Error ? err.message : "Unknown" }
    }
}

export const getStartupsBySearch = async (query: string) => {
    try {
        await connectDB();

        const startups = await Startup.find({ title: { $regex: query, $options: "i" } });

        if (!startups)
            return { status: "NOT FOUND" }

        return { status: "SUCCESS", startups: startups };
    } catch (err) {
        return { status: "ERROR", error: err instanceof Error ? err.message : "Unknown" }
    }
}