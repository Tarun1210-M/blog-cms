import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = params;
    const post = await Post.findOne({ slug });

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (err) {
    console.error("Error fetching post:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch post" }, { status: 500 });
  }
}
