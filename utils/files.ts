import { exec } from "child_process";
import { promises as fs } from "fs";

/**
 * Executes a command in a child process
 * @param command - The command to execute
 * @returns Promise with the command output
 */
const execCommand = ({ command }: { command: string }): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

/**
 * Reads and parses a JSON transcript file
 * @param fileName - Path to the JSON file
 * @returns Promise with the parsed JSON data
 */
const readJsonTranscript = async ({ fileName }: { fileName: string }): Promise<any> => {
  const data = await fs.readFile(fileName, "utf8");
  return JSON.parse(data);
};

/**
 * Converts an audio file to base64 string
 * @param fileName - Path to the audio file
 * @returns Promise with the base64 encoded string
 */
const audioFileToBase64 = async ({ fileName }: { fileName: string }): Promise<string> => {
  const data = await fs.readFile(fileName);
  return data.toString("base64");
};

export { execCommand, readJsonTranscript, audioFileToBase64 };