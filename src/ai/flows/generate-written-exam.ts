'use server';

/**
 * @fileOverview This file implements a simplified Genkit flow for generating a short written exam.
 * It takes a subject and returns a simple array of 5 question strings.
 *
 * - generateWrittenExam - A function that handles the exam generation process.
 * - GenerateWrittenExamInput - The input type for the generateWrittenExam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWrittenExamInputSchema = z.object({
  subject: z.string().describe('The subject of the exam, e.g., "Physics".'),
});
export type GenerateWrittenExamInput = z.infer<typeof GenerateWrittenExamInputSchema>;

// The output is now a simple array of strings.
const GenerateWrittenExamOutputSchema = z.array(z.string()).describe('A list of 5 exam questions.');

export async function generateWrittenExam(input: GenerateWrittenExamInput): Promise<string[]> {
  return generateWrittenExamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSimpleWrittenExamPrompt',
  input: {schema: GenerateWrittenExamInputSchema},
  output: {schema: GenerateWrittenExamOutputSchema},
  prompt: `You are an expert teacher creating a short exam for RBSE Class 12 students.
The exam is for the subject: {{{subject}}}.

CRITICAL: Generate exactly 5 short-answer questions.
Your output must be a simple JSON array of strings. Do not output anything else.

Example output for "Physics":
[
  "State Coulomb's law and define the unit of charge.",
  "What is electromagnetic induction? Give an example.",
  "Explain the difference between nuclear fission and fusion.",
  "What are the postulates of Bohr's atomic model?",
  "Define and explain the concept of total internal reflection."
]`,
});

const generateWrittenExamFlow = ai.defineFlow(
  {
    name: 'generateSimpleWrittenExamFlow',
    inputSchema: GenerateWrittenExamInputSchema,
    outputSchema: GenerateWrittenExamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      // In case of failure, return an empty array.
      return [];
    }
    return output;
  }
);
