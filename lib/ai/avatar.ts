import { generateObject } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

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
      mermaid: z
        .string()
        .describe(
          `Mermaid Diagram if user has asked any roadmap.`
        ).optional(),
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

// Example usage
/*
import { GoogleGenerativeAI } from '@google/generative-ai';

// Setup your model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Generate response
const response = await generateJackResponse("What's the roadmap to become a full-stack developer?", model);
console.log(response.messages);
*/