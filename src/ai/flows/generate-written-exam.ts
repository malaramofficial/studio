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
const GenerateWrittenExamOutputSchema = z.array(z.string()).describe('A list of 5 exam questions in Hindi.');

export async function generateWrittenExam(input: GenerateWrittenExamInput): Promise<string[]> {
  return generateWrittenExamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSimpleWrittenExamPrompt',
  input: {schema: GenerateWrittenExamInputSchema},
  output: {schema: GenerateWrittenExamOutputSchema},
  prompt: `You are an expert teacher creating a short exam for RBSE Class 12 Hindi medium students.
The exam is for the subject: {{{subject}}}.

CRITICAL: Generate exactly 5 short-answer questions in HINDI.
The questions must be suitable for Hindi medium students.
Your output must be a simple JSON array of strings, with each string being a question in Hindi. Do not output anything else.

Example output for "भौतिक विज्ञान":
[
  "कूलॉम का नियम बताइए तथा आवेश के मात्रक को परिभाषित कीजिए।",
  "विद्युतचुम्बकीय प्रेरण क्या है? एक उदाहरण दीजिए।",
  "नाभिकीय विखंडन तथा संलयन में अंतर स्पष्ट कीजिए।",
  "बोर के परमाणु मॉडल के अभिगृहीत क्या हैं?",
  "पूर्ण आन्तरिक परावर्तन की अवधारणा को परिभाषित तथा व्याख्या कीजिए।"
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
