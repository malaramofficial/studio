'use server';

/**
 * @fileOverview This file implements the Genkit flow for generating written exams based on a specific subject and chapters.
 *
 * - generateWrittenExam - A function that handles the exam generation process.
 * - GenerateWrittenExamInput - The input type for the generateWrittenExam function.
 * - GenerateWrittenExamOutput - The return type for the generateWrittenExam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWrittenExamInputSchema = z.object({
  subject: z.string().describe('The subject of the exam.'),
  chapters: z.array(z.string()).describe('The chapters to include in the exam.'),
  marks: z.number().describe('The total marks for the exam.'),
  durationMinutes: z.number().describe('The duration of the exam in minutes.'),
});
export type GenerateWrittenExamInput = z.infer<typeof GenerateWrittenExamInputSchema>;

const GenerateWrittenExamOutputSchema = z.string().describe('The generated exam in RBSE style.');
export type GenerateWrittenExamOutput = z.infer<typeof GenerateWrittenExamOutputSchema>;

export async function generateWrittenExam(input: GenerateWrittenExamInput): Promise<GenerateWrittenExamOutput> {
  return generateWrittenExamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWrittenExamPrompt',
  input: {schema: GenerateWrittenExamInputSchema},
  output: {schema: GenerateWrittenExamOutputSchema},
  prompt: `You are an expert teacher creating an exam for RBSE Class 12 students.

The exam must be based strictly on the RBSE syllabus for the given subject and chapters.

Subject: {{{subject}}}
Chapters: {{#each chapters}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Total Marks: {{{marks}}}
Duration: {{{durationMinutes}}} minutes

The exam should be in RBSE style, with the following sections:
- Section A: Short answer questions
- Section B: Long answer questions
- Section C: Very long answer questions

CRITICAL: Each question must start with a number followed by a period (e.g., "1.", "2.", "3."). This is a strict rule.

Include clear instructions for each section and the marks for each question.

Format the output as a plain text document, suitable for printing and distribution to students.`,
});

const generateWrittenExamFlow = ai.defineFlow(
  {
    name: 'generateWrittenExamFlow',
    inputSchema: GenerateWrittenExamInputSchema,
    outputSchema: GenerateWrittenExamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
