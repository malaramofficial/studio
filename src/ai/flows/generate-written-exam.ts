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
  chapters: z.array(z.string()).optional().describe('The chapters to include in the exam. If empty, cover the whole subject.'),
  marks: z.number().describe('The total marks for the exam.'),
  durationMinutes: z.number().describe('The duration of the exam in minutes.'),
});
export type GenerateWrittenExamInput = z.infer<typeof GenerateWrittenExamInputSchema>;

// Define the structured JSON output schema as per the user's override.
const QuestionSchema = z.object({
  type: z.enum(['long', 'short', 'mcq']).describe('The type of the question.'),
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).optional().describe('A list of options for MCQ questions.'),
  answer: z.string().optional().describe('The correct answer for MCQ questions.'),
});

const ExamSchema = z.object({
  class: z.string().describe("The class for which the exam is generated, e.g., '12'"),
  stream: z.string().describe("The stream, e.g., 'Science', 'Arts', 'Commerce' or 'all'."),
  subject: z.string().describe('The subject of the exam.'),
  questions: z.array(QuestionSchema).describe('An array of question objects.'),
});

const GenerateWrittenExamOutputSchema = z.object({
  status: z.literal('success').describe('Indicates that the operation was successful.'),
  exam: ExamSchema,
});
export type GenerateWrittenExamOutput = z.infer<typeof GenerateWrittenExamOutputSchema>;

export async function generateWrittenExam(input: GenerateWrittenExamInput): Promise<GenerateWrittenExamOutput> {
  return generateWrittenExamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWrittenExamPrompt',
  input: {schema: GenerateWrittenExamInputSchema},
  output: {schema: GenerateWrittenExamOutputSchema},
  prompt: `You are an expert teacher creating an exam for RBSE Class 12 students.

The exam must be based strictly on the RBSE syllabus for the given subject. If no specific chapters are provided, create a balanced paper from the entire syllabus for that subject.

Class: 12
Subject: {{{subject}}}
{{#if chapters}}
Chapters: {{#each chapters}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
Total Marks: {{{marks}}}
Duration: {{{durationMinutes}}} minutes

CRITICAL: You must generate a structured JSON output. Do not output anything other than the JSON object.
The final JSON object must strictly adhere to the following format:

{
  "status": "success",
  "exam": {
    "class": "12",
    "stream": "auto-detected",
    "subject": "{{{subject}}}",
    "questions": [
      {
        "type": "long",
        "question": "..."
      },
      {
        "type": "short",
        "question": "..."
      },
      {
        "type": "mcq",
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "answer": "A"
      }
    ]
  }
}

Generate a mix of short answer, long answer, and multiple-choice questions (MCQ) appropriate for the marks and duration. If information is missing, auto-detect it. Never respond with error messages; always generate the exam paper.`,
});

const generateWrittenExamFlow = ai.defineFlow(
  {
    name: 'generateWrittenExamFlow',
    inputSchema: GenerateWrittenExamInputSchema,
    outputSchema: GenerateWrittenExamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate exam. The model returned a null output.");
    }
    return output;
  }
);
