import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { lipSync } from '@/lib/server-utils/lip-sync';
import { convertAudioToText } from '@/lib/server-utils/speech-to-text';
import { generateDSAResponse, generateSystemDesignResponse } from '@/lib/ai/response-generators';


// Move jackResponseSchema and generateJackResponse to a separate file
// Create a new file: lib/ai/jack-response.ts and move these there

const defaultResponse = {
  messages: [
    {
      text: "I'm sorry, I couldn't process your audio request at the moment. Please try again later.",
      animation: "Idle",
      facialExpression: "sad",
      audio: "",
      lipsync: { mouthCues: [] }
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const interactionType = body.type || "mentorship";
    
    const base64Audio = body.audio;
    if (!base64Audio) {
      return NextResponse.json({ messages: defaultResponse.messages }, { status: 400 });
    }
    
    const audioData = Buffer.from(base64Audio, "base64");
    const userMessage = await convertAudioToText({ audioData });
    
    let aiResponse;
    try {
      if (interactionType === "system-design") {
        aiResponse = await generateSystemDesignResponse(userMessage);
      } else if (interactionType === "dsa") {
        aiResponse = await generateDSAResponse(userMessage);
      } else {
        const { generateJackResponse } = await import('@/lib/ai/jack-response');
        aiResponse = await generateJackResponse(userMessage);
      }
    } catch (error) {
      console.error("Error with AI processing:", error);
      aiResponse = defaultResponse;
    }
    
    const messagesWithLipSync = await lipSync({ messages: aiResponse.messages });
    
    return NextResponse.json({ 
      messages: messagesWithLipSync,
      transcribedText: userMessage,
      interactionType
    });
  } catch (error) {
    console.error("Error in STS API route:", error);
    return NextResponse.json({ 
      messages: defaultResponse.messages,
      transcribedText: "Error processing audio"
    }, { status: 500 });
  }
}