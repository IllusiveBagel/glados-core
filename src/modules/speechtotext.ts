import { pipeline } from "@xenova/transformers";
import wavefile from "wavefile";

const recognise = async (audioBuffer: Buffer) => {
  let transcriber = await pipeline(
    "automatic-speech-recognition",
    "Xenova/whisper-tiny.en",
  );

  // Read .wav file and convert it to required format
  let wav = new wavefile.WaveFile(audioBuffer);
  wav.toBitDepth("32f"); // Pipeline expects input as a Float32Array
  wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
  let audioData = wav.getSamples();
  if (Array.isArray(audioData)) {
    // For this demo, if there are multiple channels for the audio file, we just select the first one.
    // In practice, you'd probably want to convert all channels to a single channel (e.g., stereo -> mono).
    audioData = audioData[0];
  }

  let start = performance.now();
  let output = await transcriber(audioData);
  let end = performance.now();
  console.log(`Execution duration: ${(end - start) / 1000} seconds`);
  return Array.isArray(output) ? output[0].text : output.text;
};

export default { recognise };
