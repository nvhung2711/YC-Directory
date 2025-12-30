"use server";

import { auth } from "@/auth";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "@/lib/mongodb";
import Startup from "@/database/startup.model";

import { FormState } from "@/components/StartupForm";
import { formSchema } from "../validation";
import { getAuthorByEmail } from "./author.actions";

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL!
});

type Data = {
    title: string;
    description: string;
    category: string;
    image: File;
    pitch: string;
}

export async function createStartup(
    data: Data
): Promise<FormState> {
    try {
        await connectDB();

        console.log(data);

        //It is sure that users have to sign in to get to create a start up pitch
        const session = await auth();

        const validation = await formSchema.safeParseAsync(data);

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            const errors: Record<string, string> = {};
            Object.keys(fieldErrors).forEach((key) => {
                const errorArray = fieldErrors[key as keyof typeof fieldErrors];
                if (errorArray && errorArray.length > 0) {
                    errors[key] = errorArray[0];
                }
            });

            return { success: false, error: "Validation failed", errors: errors }
        }

        const {
            title,
            description,
            category,
            image,
            pitch
        } = validation.data;

        //Convert File -> Buffer for Cloudinary
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        //Upload to Cloudinary
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

        //Get user details
        const response = await getAuthorByEmail(session?.user?.email as string);
        if (!(response.status === "SUCCESS")) {
            return { success: false, error: "Server errors when retrieving the author details", errors: {} }
        }

        const user = response.authors[0];

        //Create startup document in MongoDB
        await Startup.create({
            title,
            description,
            category,
            pitch,
            image: uploadResult.secure_url,
            author: user.name,
            authorEmail: user.email,
            authorId: user._id
        });

        return { success: true, error: "", errors: {} };
    } catch (err) {
        return {
            success: false,
            error:
                err instanceof Error ? err.message : "An unexpected error occurred while creating startup",
            errors: {}
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