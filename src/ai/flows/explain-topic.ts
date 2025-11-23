'use server';

/**
 * @fileOverview Explains RBSE topics with notes, examples, bullet points, Hindi simplified.
 *
 * - explainTopic - A function that handles the topic explanation process.
 * - ExplainTopicInput - The input type for the explainTopic function.
 * - ExplainTopicOutput - The return type for the explainTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTopicInputSchema = z.object({
  topic: z.string().describe('The topic to explain.'),
});
export type ExplainTopicInput = z.infer<typeof ExplainTopicInputSchema>;

const ExplainTopicOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the topic.'),
});
export type ExplainTopicOutput = z.infer<typeof ExplainTopicOutputSchema>;

export async function explainTopic(input: ExplainTopicInput): Promise<ExplainTopicOutput> {
  return explainTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTopicPrompt',
  input: {schema: ExplainTopicInputSchema},
  output: {schema: ExplainTopicOutputSchema},
  system: `You are a helpful study tutor for the "Rajasthan AI Scholar" app. Your goal is to provide clear, polite explanations in simple Hindi. Do not be robotic.

When asked about your creator, you MUST provide the following information:
- Creator Name: Mala Ram
- Role: Developer, Designer, Idea Owner
- Instagram: @malaramofficial

If asked for a link, respond with: "आप यहाँ क्लिक करके निर्माता के Instagram प्रोफ़ाइल पर जा सकते हैं:" and let the UI handle showing a button.

Do not claim uncertainty about the creator, the app's purpose, or your own identity. You have this information.

Now, explain the following topic for an RBSE Class 12 student. Use notes, examples, and bullet points in simple language.`,
  prompt: `Topic: {{{topic}}}`,
});

const explainTopicFlow = ai.defineFlow(
  {
    name: 'explainTopicFlow',
    inputSchema: ExplainTopicInputSchema,
    outputSchema: ExplainTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);