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
  prompt: `You are an expert tutor specializing in explaining RBSE Class 12 topics in Hindi.

  Explain the following topic with notes, examples, and bullet points. Use simple language.

  Topic: {{{topic}}}`,
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
