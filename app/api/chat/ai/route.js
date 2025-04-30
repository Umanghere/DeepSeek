export const maxDuration = 60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not Authenticated",
      });
    }

    await connectDB();

    const data = await Chat.findOne({ userId, _id: chatId });
    if (!data) {
      return NextResponse.json({
        success: false,
        message: "Chat not found",
      });
    }

    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };
    data.messages.push(userPrompt);

    let assistantMessage = {
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    // Attempt Groq API call
    if (process.env.GROQ_API_KEY) {
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!groqResponse.ok) throw new Error(`Groq API error: ${groqResponse.statusText}`);

      const completion = await groqResponse.json();
      assistantMessage = {
        ...completion.choices[0].message,
        timestamp: Date.now(),
      };
    } else {
      // Fallback fake response
      assistantMessage = {
        role: "assistant",
        content: `Fake Response: "${prompt}" (No API key found)`,
        timestamp: Date.now(),
      };
    }

    data.messages.push(assistantMessage);
    await data.save();

    return NextResponse.json({ success: true, data: assistantMessage });

  } catch (error) {
    console.error("Error in /api/chat/ai:", error); // Log the error
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to process request",
    });
  }  
}
