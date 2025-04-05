import fs from "fs";
import path from "path";
import { execCommand } from "./files";


/**
 * Converts audio data from webm format to mp3
 * @param audioData - The binary audio data in webm format
 * @returns Promise with the converted mp3 audio data
 */
async function convertAudioToMp3({ audioData }: { audioData: Buffer }): Promise<Buffer> {
  const dir = 'tmp';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  
  const inputPath = path.join(dir, "input.webm");
  fs.writeFileSync(inputPath, audioData);
  
  const outputPath = path.join(dir, "output.mp3");
  await execCommand({ command: `ffmpeg -i ${inputPath} ${outputPath}` });
  
  const mp3AudioData = fs.readFileSync(outputPath);
  
  // Clean up temporary files
  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);
  
  return mp3AudioData;
}

export { convertAudioToMp3 };