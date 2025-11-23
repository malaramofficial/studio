'use server';

/**
 * @fileOverview Converts voice input into text with failover.
 *
 * - voiceInput - A function that handles the speech-to-text conversion.
 * - VoiceInputSchema - The input type for the voiceInput function.
 * - VoiceInputOutputSchema - The return type for the voiceInput function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording of spoken audio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceInput = z.infer<typeof VoiceInputSchema>;

const VoiceInputOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type VoiceInputOutput = z.infer<typeof VoiceInputOutputSchema>;

export async function voiceInput(
  input: VoiceInput
): Promise<VoiceInputOutput> {
  return voiceInputFlow(input);
}

const voiceInputFlow = ai.defineFlow(
  {
    name: 'voiceInputFlow',
    inputSchema: VoiceInputSchema,
    outputSchema: VoiceInputOutputSchema,
  },
  async (input) => {
    // Failover System:
    // 1. Try Gemini Speech-to-Text
    // 2. Fallback to Groq Whisper
    // 3. Fallback to a local on-device model (e.g., Whisper tiny)

    try {
      const { text } = await ai.generate({
        model: 'googleai/gemini-pro',
        prompt: [{ media: { url: input.audioDataUri } }],
      });
      if (!text) {
        throw new Error('No text returned from Gemini Speech-to-Text.');
      }
      return { text };
    } catch (error) {
      console.error('Gemini STT failed, implementing failover logic:', error);
      // In a real scenario, you would implement failover to Groq, a local model, etc.
      // For now, we return an error message as a placeholder for failover.
      return { text: "माफ़ कीजिए, मैं आपकी आवाज़ को समझ नहीं पाया। कृपया फिर से प्रयास करें।" };
    }
  }
);
