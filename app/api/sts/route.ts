import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { lipSync } from '@/lib/server-utils/lip-sync';
import { convertAudioToText } from '@/lib/server-utils/speech-to-text';
import { generateObject } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { generateSystemDesignResponse } from '../tts/route';

// Default response in case of errors
const defaultResponse = {
  messages: [
    {
      text: "I'm sorry, I couldn't process your audio request at the moment. Please try again later.",
      animation: "Idle",
      facialExpression: "sad",
      audio: "", // Base64 encoded audio would go here
      lipsync: { mouthCues: [] }
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const interactionType = body.type || "mentorship";
    console.log("STS Request Body received");
    
    // Extract the base64 audio
    const base64Audio = body.audio;
    if (!base64Audio) {
      console.error("No audio data provided");
      return NextResponse.json({ messages: defaultResponse.messages }, { status: 400 });
    }
    
    // Convert base64 to buffer
    const audioData = Buffer.from(base64Audio, "base64");
    
    // Convert audio to text
    console.log("Converting audio to text...");
    const userMessage = await convertAudioToText({ audioData });
    console.log("Transcribed message:", userMessage);
    
    // Process with AI
    let aiResponse;
    try {
      if (interactionType === "system-design") {
        aiResponse = await generateSystemDesignResponse(userMessage);
      } else {
        // Default to mentorship response
        aiResponse = await generateJackResponse(userMessage);
      }
      console.log("AI response received:", aiResponse.messages);
    } catch (error) {
      console.error("Error with AI processing:", error);
      aiResponse = defaultResponse;
    }
    
    // Generate lip sync data for the messages
    console.log("Generating lip sync data...");
    const messagesWithLipSync = await lipSync({ messages: aiResponse.messages });
    
    // Return the response with the transcribed text
    return NextResponse.json({ 
      messages: messagesWithLipSync,
      transcribedText: userMessage ,
      interactionType
    });
  } catch (error) {
    console.error("Error in STS API route:", error);
    return NextResponse.json({ 
      messages: defaultResponse.messages,
      transcribedText: "Error processing audio"  // Include error message for transcription
    }, { status: 500 });
  }
}

// Define the schema - same as in TTS route
const jackResponseSchema = z.object({
  messages: z.array(
    z.object({
      text: z.string().describe("Text to be spoken by the AI"),
      facialExpression: z
        .string()
        .describe(
          "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
        ),
      animation: z
        .string()
        .describe(
          `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
          Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
        ),
      mermaid: z
        .string()
        .describe(
          `Mermaid Diagram if user has asked any roadmap.`
        ).optional(),
    })
  )
});

// Function to generate responses using Vercel AI SDK - same as in TTS route
export async function generateJackResponse(userMessage: string) {
  const systemInstruction = `
    You are Jack, a topmate SDE mentor, you should help in any way possible.
    You will always respond with a maximpum of 3 messages.
    Each message has properties for text, facialExpression, and animation.
    The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
    The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, 
    Surprised, DismissingGesture and ThoughtfulHeadShake.
    If user needs roadmap or there any concept, which you can explain better using flowchart use mermaid.
  `;

  try {
    const { object: response } = await generateObject({
      model: google('gemini-2.5-pro-exp-03-25',
        {
          structuredOutputs: false,
        }),
      schema: jackResponseSchema,
      prompt: `${systemInstruction}\n\nUser Message: ${userMessage}`,
      maxTokens: 1000
    });

    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    return {
      messages: [
        {
          text: "I'm sorry, I couldn't process your request at the moment. Please try again later.",
          animation: "Idle",
          facialExpression: "sad"
        }
      ]
    };
  }
}