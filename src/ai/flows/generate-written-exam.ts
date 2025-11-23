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
import { syllabus } from '@/lib/syllabus';

const GenerateWrittenExamInputSchema = z.object({
  subject: z.string().describe('The subject of the exam, e.g., "Physics".'),
});
export type GenerateWrittenExamInput = z.infer<typeof GenerateWrittenExamInputSchema>;

// The output is now a simple array of strings.
const GenerateWrittenExamOutputSchema = z.array(z.string()).describe('A list of 5 exam questions in Hindi.');

export async function generateWrittenExam(input: GenerateWrittenExamInput): Promise<string[]> {
  // Find the subject details from the syllabus
  let subjectDetails = null;
  for (const stream of syllabus) {
    const foundSubject = stream.subjects.find(s => s.name === input.subject);
    if (foundSubject) {
      subjectDetails = foundSubject;
      break;
    }
  }

  // Pass subject details to the flow, or just the name if not found.
  return generateWrittenExamFlow({
    subject: input.subject,
    subjectDetails: subjectDetails ? JSON.stringify(subjectDetails, null, 2) : 'Not available',
  });
}

const FlowInputSchema = z.object({
  subject: z.string(),
  subjectDetails: z.string(),
});

const prompt = ai.definePrompt({
  name: 'generateSimpleWrittenExamPrompt',
  input: {schema: FlowInputSchema},
  output: {schema: GenerateWrittenExamOutputSchema},
  config: {
    // Set a higher temperature to encourage creativity and reduce repetition.
    temperature: 1,
  },
  prompt: `You are an expert teacher creating a short exam for RBSE Class 12 Hindi medium students.
The exam is for the subject: {{{subject}}}.

Here is the official syllabus for the subject. You MUST base your questions on the units and chapters provided in this syllabus.
<syllabus>
{{{subjectDetails}}}
</syllabus>

CRITICAL INSTRUCTIONS:
1. Generate exactly 5 unique and completely new short-answer questions in HINDI every single time. Do not repeat questions from previous requests.
2. The questions must be suitable for Hindi medium students and based on the provided syllabus.
3. Your output must be a simple JSON array of strings, with each string being a question in Hindi. Do not output anything else.

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
    inputSchema: FlowInputSchema,
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
