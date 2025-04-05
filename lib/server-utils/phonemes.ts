import { execCommand } from "@/utils/files";


const getPhonemes = async ({ message }: { message: number }) => {
  try {
    const time = new Date().getTime();
    console.log(`Starting conversion for message ${message}`);
    await execCommand(
      { command: `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav` }
      // -y to overwrite the file
    );
    console.log(`Conversion done in ${new Date().getTime() - time}ms`);
    await execCommand({
      command: `${process.cwd()}/bin/rhubarb/rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`,
    });
    // -r phonetic is faster but less accurate
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
  } catch (error) {
    console.error(`Error while getting phonemes for message ${message}:`, error);
  }
};

export { getPhonemes };