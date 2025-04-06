import { NextRequest, NextResponse } from 'next/server';
import { lipSync } from '@/lib/server-utils/lip-sync';
import { generateAnalysisResponse, generateDSAResponse, generateSystemDesignResponse } from '@/lib/ai/response-generators';
import { generateJackResponse } from '@/lib/ai/jack-response';

const defaultResponse = {
  messages: [
    {
      text: "I'm sorry, I couldn't process your request at the moment. Please try again later.",
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
    console.log("Request Body:", body);
    const userMessage = body.message;
    const interactionType = body.type || "mentorship"; // Default to mentorship if no type provided
    
    console.log("User Message:", userMessage);
    console.log("Interaction Type:", interactionType);
    
    console.log("Proceeding to AI model");
    

    
    // Process with Gemini and Vercel AI SDK based on interaction type
    let aiResponse;
    try {
      if (interactionType === "system-design") {
        aiResponse = await generateSystemDesignResponse(userMessage);
      } else if(interactionType=="analysis"){
      aiResponse = await generateAnalysisResponse(userMessage); // Assuming you have a function for this in your ap
      } else if(interactionType=="dsa"){
        // Default to mentorship response
        aiResponse = await generateDSAResponse(userMessage);
      }
      else {
        // Default to mentorship response
        aiResponse = await generateJackResponse(userMessage);
      }
      console.log("AI response received:", aiResponse.messages);
    } catch (error) {
      console.error("Error with AI processing:", error);
      aiResponse = defaultResponse;
    }
    
    // Generate lip sync data for the messages
    const messagesWithLipSync = await lipSync({ messages: aiResponse.messages });
    
    // Return the response
    return NextResponse.json({ messages: messagesWithLipSync, interactionType });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ messages: defaultResponse.messages }, { status: 500 });
  }
}



  
