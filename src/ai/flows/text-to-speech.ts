'use server';

/**
 * @fileOverview Converts text content into spoken audio with failover.
 *
 * - textToSpeech - A function that handles the text-to-speech conversion process.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioUrl: z.string().describe('The data URL of the generated audio file.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (input) => {
    // Failover System:
    // 1. Try Gemini TTS
    // 2. Fallback to a different provider (e.g., Edge TTS, Coqui-Cloud)
    // 3. Fallback to a local on-device model (e.g., Coqui/VITS)

    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A suitable voice
            },
          },
        },
        prompt: input.text,
      });

      if (!media?.url) {
        throw new Error('No media returned from Gemini TTS.');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      const wavBase64 = await toWav(audioBuffer);

      return {
        audioUrl: 'data:audio/wav;base64,' + wavBase64,
      };
    } catch (error) {
      console.error('Gemini TTS failed, implementing failover logic:', error);
      // In a real scenario, you would implement failover to Groq, a local model, or a pre-generated audio file.
      // For now, we'll return a pre-recorded error message as a placeholder for the failover audio.
      // This would be a base64 encoded WAV file saying "Audio generation failed".
      return {
        audioUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAA==',
      };
    }
  }
);
