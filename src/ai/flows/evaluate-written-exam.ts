'use server';

/**
 * @fileOverview This file defines the Genkit flow for evaluating written exams.
 *
 * - evaluateWrittenExam - The function to evaluate written exam answers.
 * - EvaluateWrittenExamInput - The input type for the evaluateWrittenExam function.
 * - EvaluateWrittenExamOutput - The output type for the evaluateWrittenExam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateWrittenExamInputSchema = z.object({
  questions: z.array(z.string()).describe('The questions of the exam.'),
  answers: z.array(z.string()).describe('The student answers to the questions.'),
});
export type EvaluateWrittenExamInput = z.infer<typeof EvaluateWrittenExamInputSchema>;

const EvaluateWrittenExamOutputSchema = z.object({
  perQuestion: z.array(
    z.object({
      marks: z.number().describe('The marks obtained for the question.'),
      feedback: z.string().describe('The feedback for the answer in Hindi.'),
    })
  ).describe('The evaluation for each question.'),
  totalScore: z.number().describe('The total score obtained in the exam.'),
  percentage: z.number().describe('The percentage obtained in the exam.'),
  improvementAdvice: z.string().describe('The advice for improving the performance in Hindi.'),
  weakAreas: z.array(z.string()).describe('The weak areas that need improvement in Hindi.'),
});
export type EvaluateWrittenExamOutput = z.infer<typeof EvaluateWrittenExamOutputSchema>;

export async function evaluateWrittenExam(input: EvaluateWrittenExamInput): Promise<EvaluateWrittenExamOutput> {
  return evaluateWrittenExamFlow(input);
}

const evaluateWrittenExamPrompt = ai.definePrompt({
  name: 'evaluateWrittenExamPrompt',
  input: {schema: EvaluateWrittenExamInputSchema},
  output: {schema: EvaluateWrittenExamOutputSchema},
  prompt: `You are an expert teacher evaluating student answers for an exam for Hindi medium students.

CRITICAL: All of your output (feedback, advice, weak areas) MUST be in HINDI.

Evaluate the answers based on the questions and provide feedback, marks, and identify weak areas.

Questions: {{{questions}}}
Answers: {{{answers}}}

Provide the output in JSON format.`,
});

const evaluateWrittenExamFlow = ai.defineFlow(
  {
    name: 'evaluateWrittenExamFlow',
    inputSchema: EvaluateWrittenExamInputSchema,
    outputSchema: EvaluateWrittenExamOutputSchema,
  },
  async input => {
    const {output} = await evaluateWrittenExamPrompt(input);
    return output!;
  }
);
