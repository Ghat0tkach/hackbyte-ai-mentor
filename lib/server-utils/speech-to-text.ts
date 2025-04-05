

import fs from "fs";
import Groq from "groq-sdk";
import { convertAudioToMp3 } from "@/utils/audio-converter";

interface ConvertAudioToTextProps {
  audioData: Buffer;
}

export async function convertAudioToText({ audioData }: ConvertAudioToTextProps): Promise<string> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      console.error("Missing Groq API key");
      return "I couldn't process your audio due to a configuration issue. Please try again later.";
    }
    
    // Initialize Groq client
    const groq = new Groq({
      apiKey: groqApiKey
    });
    
    // Convert audio to MP3 format
    const mp3AudioData = await convertAudioToMp3({ audioData });
    
    // Save to temporary file
    const outputPath = "/tmp/output.mp3";
    fs.writeFileSync(outputPath, mp3AudioData);
    
    // Use Groq to transcribe
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(outputPath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });
    
    // Clean up temporary file
    fs.unlinkSync(outputPath);
    
    console.log("Transcribed text:", transcription.text);
    return transcription.text;
  } catch (error) {
    console.error("Error in speech-to-text conversion:", error);
    return "I couldn't understand the audio. Could you please try again?";
  }
}