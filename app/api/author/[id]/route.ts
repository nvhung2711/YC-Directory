import mongoose from "mongoose";

import Author from "@/database/author.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    id: string;
  }>
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB();

    const id = new mongoose.Types.ObjectId((await params).id);

    const author = await Author.findById(id);

    if (!author)
      return NextResponse.json({ message: 'Author not found' }, { status: 404 });

    return NextResponse.json({ message: 'Author fetched successfully', author: author }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed fetching author by id', error: err instanceof Error ? err.message : 'Unknown' }, { status: 500 });
  }
}