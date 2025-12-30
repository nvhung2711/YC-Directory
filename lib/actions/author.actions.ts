"use server";

import mongoose from "mongoose";

import connectDB from "../mongodb";
import Author, { IAuthor } from "@/database/author.model";

export type AuthorResult = { status: "SUCCESS"; authors: IAuthor[] } | { status: "ERROR"; error: string } | { status: "NOT FOUND" };

export const getAuthorById = async (id: string): Promise<AuthorResult> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { status: "NOT FOUND" }
    }

    try {
        await connectDB();

        const author = await Author.findById(new mongoose.Types.ObjectId(id));

        const authors = author ? [author] : [];

        return { status: "SUCCESS", authors: authors };
    } catch (err) {
        return { status: "ERROR", error: err instanceof Error ? err.message : "Unknown" }
    }
}

export const getAuthorByEmail = async (email: string): Promise<AuthorResult> => {
    try {
        await connectDB();

        const authors = await Author.find({ email: email });

        return { status: "SUCCESS", authors: authors };
    } catch (err) {
        return { status: "ERROR", error: err instanceof Error ? err.message : "Unknown" }
    }
}