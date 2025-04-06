import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    console.log("Received image for analysis");
    const { imageData, questionText } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageData,
          mimeType: "image/png", // Using PNG format as that's what canvas.toDataURL produces
        },
      },
      `The user is practicing ${questionText || 'system design'} and has created this image. Based on this, analyze the image in detail and explain what the user is doing.`,
    ]);

    console.log("Analysis generated");
    return NextResponse.json({ caption: result.response.text() });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}