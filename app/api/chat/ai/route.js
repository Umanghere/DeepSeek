export const maxDuration = 60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    console.log("API called with:", { userId, chatId, prompt });

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated. Please login first.",
      });
    }

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({
        success: false,
        message: "Please enter a message.",
      });
    }

    await connectDB();

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return NextResponse.json({
        success: false,
        message: "Chat not found. Please try creating a new chat.",
      });
    }

    // Add user message to chat
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };
    chat.messages.push(userPrompt);

    let assistantMessage = {
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    // Check if Groq API key exists
    if (!process.env.GROQ_API_KEY) {
      console.log("No Groq API key found");
      assistantMessage = {
        role: "assistant",
        content: `I apologize, but the AI service is currently unavailable. The API key is not configured. Please contact the administrator.`,
        timestamp: Date.now(),
      };
    } else {
      try {
        console.log("Making Groq API call...");

        // Prepare conversation history for context
        const conversationHistory = chat.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Add current prompt to history
        conversationHistory.push({
          role: "user", 
          content: prompt
        });

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: conversationHistory, // Send full conversation history
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        console.log("Groq API response status:", groqResponse.status);

        if (!groqResponse.ok) {
          const errorText = await groqResponse.text();
          console.error("Groq API error:", errorText);
          
          // Handle specific error cases
          if (groqResponse.status === 401) {
            throw new Error("Invalid API key. Please check your Groq API key.");
          } else if (groqResponse.status === 429) {
            throw new Error("Rate limit exceeded. Please try again in a few minutes.");
          } else if (groqResponse.status === 503) {
            throw new Error("AI service is temporarily unavailable. Please try again later.");
          } else {
            throw new Error(`Groq API error: ${groqResponse.statusText}`);
          }
        }

        const completion = await groqResponse.json();
        console.log("Groq API success:", completion);

        if (completion.choices && completion.choices[0] && completion.choices[0].message) {
          assistantMessage = {
            role: "assistant",
            content: completion.choices[0].message.content,
            timestamp: Date.now(),
          };
        } else {
          throw new Error("Invalid response format from AI service");
        }

      } catch (apiError) {
        console.error("API Error:", apiError);
        
        assistantMessage = {
          role: "assistant",
          content: `I apologize, but I'm having trouble processing your request right now. Error: ${apiError.message}. Please try again in a few moments.`,
          timestamp: Date.now(),
        };
      }
    }

    // Save the complete conversation
    chat.messages.push(assistantMessage);
    await chat.save();

    console.log("Response sent:", assistantMessage);

    return NextResponse.json({ 
      success: true, 
      data: assistantMessage,
      message: "Response generated successfully"
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }  
}