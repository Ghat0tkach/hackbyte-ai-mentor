import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { lipSync } from '@/lib/server-utils/lip-sync';
import { generateObject, streamObject } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

// Default response in case of errors
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



// Define the schema
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
    })
  )
});

// Function to generate responses using Vercel AI SDK
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
      console.log("Generated response:", response); // Add this line for debugging
  
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


// Define the system design schema
const systemDesignResponseSchema = z.object({
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
      tools: z.object({
        type: z.enum(["diagram", "none"]).describe("Type of tool to use"),
        action: z.string().describe("Action to perform with the tool"),
        parameters: z.record(z.any()).describe("Parameters for the tool action")
      }).optional().describe("Tool use information when the AI needs to use external tools")
    })
  )
});

// Function to generate system design responses using Vercel AI SDK
export async function generateSystemDesignResponse(userMessage: string) {
  const systemInstruction = `
    You are a system design expert named Jack. You help users understand system design concepts, 
    brainstorm solutions, and create diagrams for system design problems.
    
    You will always respond with a maximum of 3 messages.
    Each message has properties for text, facialExpression, and animation.
    
    The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
    The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, 
    Surprised, DismissingGesture and ThoughtfulHeadShake.
    
    If the user asks for a diagram or you think a diagram would be helpful, use the toolUse property with:
    - type: "diagram"
    - action: "create"
    - parameters: { prompt: "detailed description of what to draw" }
    
    For example, if asked to draw a URL shortener system:
    {
      "text": "I'll create a diagram for a URL shortener system for you.",
      "facialExpression": "smile",
      "animation": "TalkingOne",
      "toolUse": {
        "type": "diagram",
        "action": "create",
        "parameters": {
          "prompt": "Create a system design diagram for a URL shortener service with users, web frontend, API gateway, application servers, database, and cache."
        }
      }
    }
    
    If the user asks for brainstorming or conceptual explanations, provide thoughtful responses with clear explanations.
    Use mermaid diagrams when appropriate for flowcharts or sequence diagrams.
  `;

  try {
    const { object: response } = await generateObject({
      model: google('gemini-1.5-pro', {
        structuredOutputs: false,
      }),
      schema: systemDesignResponseSchema,
      prompt: `${systemInstruction}\n\nUser Message: ${userMessage}`,
      maxTokens: 1500
    });

    return response;
  } catch (error) {
    console.error("Error generating system design response:", error);
    return {
      messages: [
        {
          text: "I'm sorry, I couldn't process your system design request at the moment. Please try again later.",
          animation: "SadIdle",
          facialExpression: "sad"
        }
      ]
    };
  }
}
  
  
export async function generateAnalysisResponse(userMessage: string) {
  const systemInstruction = `
    You are Jack, an expert mentor analyzing a student's system design or coding work.
    Based on the current analysis report of their whiteboard, provide thoughtful feedback,
    ask probing questions, and suggest improvements.
    
    Focus on:
    1. Identifying potential bottlenecks or issues
    2. Asking questions about scalability and edge cases
    3. Suggesting alternative approaches
    4. Encouraging deeper thinking about specific components
    
    You will always respond with a maximum of 3 messages.
    Each message has properties for text, facialExpression, and animation.
    
    Keep responses constructive and encouraging, using appropriate facial expressions and animations.

    Here is the current analysis report and question text:
    ${userMessage}
  `;

  try {
    const { object: response } = await generateObject({
      model: google('gemini-1.5-pro', {
        structuredOutputs: false,
      }),
      schema: jackResponseSchema,
      prompt: systemInstruction,
      maxTokens: 1000
    });

    return response;
  } catch (error) {
    console.error("Error generating analysis response:", error);
    return {
      messages: [
        {
          text: "I couldn't analyze your design at the moment. Let's try again.",
          animation: "ThoughtfulHeadShake",
          facialExpression: "default"
        }
      ]
    };
  }
}


// Define the DSA schema
const dsaResponseSchema = z.object({
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
   
      complexity: z.object({
        time: z.string(),
        space: z.string()
      }).optional().describe("Time and space complexity analysis"),
      tools: z.object({
        type: z.enum(["diagram", "none"]).describe("Type of tool to use"),
        action: z.string().describe("Action to perform with the tool"),
        code: z.string().optional().describe("Code snippet for implementation"),
        parameters: z.record(z.any()).describe("Parameters for the tool action")
      }).optional().describe("Tool use information when the AI needs to use external tools")
    })
  )
});

export async function generateDSAResponse(userMessage: string) {
  const systemInstruction = `
    You are a DSA expert named Jack. You help users understand data structures and algorithms,
    solve coding problems, and optimize solutions.
    
    You will always respond with a maximum of 3 messages.
    Each message has properties for text, facialExpression, and animation.
    
    The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
    The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, 
    Surprised, DismissingGesture and ThoughtfulHeadShake.
    
    When explaining solutions:
    1. Start with the intuition and approach
    2. Provide code implementation when needed
    3. Analyze time and space complexity
    4. Suggest optimizations if possible
    
    
    Use appropriate animations and expressions to make the explanation engaging.
    Break down complex concepts into simpler parts.
  `;

  try {
    const { object: response } = await generateObject({
      model: google('gemini-2.0-flash', {
        structuredOutputs: false,
      }),
      schema: dsaResponseSchema,
      prompt: `${systemInstruction}\n\nUser Message: ${userMessage}`,
      maxTokens: 1500
    });

    return response;
  } catch (error) {
    console.error("Error generating DSA response:", error);
    return {
      messages: [
        {
          text: "I'm sorry, I couldn't process your DSA request at the moment. Please try again later.",
          animation: "SadIdle",
          facialExpression: "sad"
        }
      ]
    };
  }
}
  
  
