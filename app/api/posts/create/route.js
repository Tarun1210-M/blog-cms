import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import slugify from "slugify";

export async function POST(req) {
  try {
    await connectDB();

    const { title, content } = await req.json();

    const slug = slugify(title, { lower: true, strict: true });

    const newPost = new Post({ title, content, slug });
    await newPost.save();

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (err) {
    console.error("Error creating post:", err);
    return NextResponse.json({ success: false, message: "Post creation failed" }, { status: 500 });
  }
}
