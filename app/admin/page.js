"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const bgRef = useRef(null);
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const handleSubmit = async () => {
    const content = editor.getHTML();
    if (!title || !content) {
      setMessage("⚠️ Please fill in all fields");
      return;
    }

    const res = await fetch("/api/posts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("✅ Post created!");
      setTitle("");
      editor.commands.setContent("");
    } else {
      setMessage("❌ Error: " + data.message);
    }
  };

  // 🎯 Mousemove animation
  useEffect(() => {
    const bg = bgRef.current;
    const move = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      bg.style.background = `
        radial-gradient(at ${x * 100}% ${y * 100}%, #ff00ff, #ffff00, #00ffff)
      `;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Background */}
      <div
        ref={bgRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          background: "radial-gradient(circle at center, #ff00ff, #ffff00, #00ffff)",
          transition: "background 0.2s ease",
          filter: "blur(60px)",
        }}
      ></div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 20px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
          top: "10vh",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#222" }}>
           Create Blog Post
        </h1>

        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            marginBottom: "16px",
            border: "1px solid #ddd",
          }}
        />

        <EditorContent
          editor={editor}
          style={{
            minHeight: "180px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
           Create Post
        </button>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: message.includes("✅") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
