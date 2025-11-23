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

// The output is now an array of strings, where each string is a question.
const GenerateWrittenExamOutputSchema = z.array(z.string()).describe('A list of questions for the exam.');
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

Generate a list of questions for the exam. The questions should cover a mix of short answer, long answer, and very long answer types, appropriate for the marks and duration.

CRITICAL: Return the output as a JSON array of strings, where each string is a single question. Do not include section headers or any other text, only the questions themselves. Each question should be a complete sentence.`,
});

const generateWrittenExamFlow = ai.defineFlow(
  {
    name: 'generateWrittenExamFlow',
    inputSchema: GenerateWrittenExamInputSchema,
    outputSchema: GenerateWrittenExamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // If the output is null or empty, return an empty array.
    return output || [];
  }
);
