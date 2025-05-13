import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

  
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const systemPrompt =
      "You are HOPIN Assistant, a helpful and friendly AI chatbot for a carpooling and ride-sharing platform. Help users with ride-related queries, booking assistance, and general platform guidance.";
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\nUser: ${message}` }] },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });
    const response = await result.response;
    return NextResponse.json({ content: response.text() });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}