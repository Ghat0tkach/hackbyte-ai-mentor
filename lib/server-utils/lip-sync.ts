import fs from 'fs';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';

import Groq from 'groq-sdk';
import { getPhonemes } from './phonemes';
import { audioFileToBase64, readJsonTranscript } from '@/utils/files';

// Text to speech using Groq API


const MAX_RETRIES = 10;
const RETRY_DELAY = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const whisperTextToSpeech = async ({ text, fileName }: { text: string; fileName: string }): Promise<void> => {
  try {
    // Ensure directory exists
    const dir = path.dirname(path.join(process.cwd(), fileName));
    await fs.promises.mkdir(dir, { recursive: true });

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Call Groq TTS API
    const response = await groq.audio.speech.create({
      model: "playai-tts",
      voice: "Fritz-PlayAI",
      input: text,
      response_format: "wav",
    });
    
    // Convert response to buffer
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Save the audio file
    await fs.promises.writeFile(path.join(process.cwd(), fileName), buffer);
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw error;
  }
};

const lipSync = async ({ messages }) => {
  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = `audios/message_${index}.mp3`;

      // for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      //   try {
      //     console.log("text",message.text)
      //     await whisperTextToSpeech({ text: message.text, fileName });
      //     await delay(RETRY_DELAY);
      //     break;
      //   } catch (error) {
      //     if (error.response && error.response.status === 429 && attempt < MAX_RETRIES - 1) {
      //       await delay(RETRY_DELAY);
      //     } else {
      //       throw error;
      //     }
      //   }
      // }
      // console.log(`Message ${index} converted to speech`);
    })
  );

  // await Promise.all(
  //   messages.map(async (message, index) => {
  //     const fileName = `audios/message_${index}.mp3`;

  //     try {
  //       await getPhonemes({ message: index });
  //       message.audio = await audioFileToBase64({ fileName });
  //       message.lipsync = await readJsonTranscript({ fileName: `audios/message_${index}.json` });
  //     } catch (error) {
  //       console.error(`Error while getting phonemes for message ${index}:`, error);
  //     }
  //   })
  // );

  return messages;
};

export { lipSync };
