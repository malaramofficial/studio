"use server";

import { generateWrittenExam as genExam, type GenerateWrittenExamInput, type GenerateWrittenExamOutput } from "@/ai/flows/generate-written-exam";
import { evaluateWrittenExam as evalExam, type EvaluateWrittenExamInput } from "@/ai/flows/evaluate-written-exam";

export async function generateWrittenExam(input: GenerateWrittenExamInput): Promise<GenerateWrittenExamOutput> {
  try {
    const result = await genExam(input);
    return result;
  } catch (error) {
    console.error("Error in generateWrittenExam:", error);
    // Return an empty array in case of an error to prevent crashes.
    return [];
  }
}

export async function evaluateWrittenExam(input: EvaluateWrittenExamInput) {
  try {
    const result = await evalExam(input);
    return result;
  } catch (error) {
    console.error("Error in evaluateWrittenExam:", error);
     // In a real app, you'd have more robust failover here (Groq, rule-based, etc.)
    // For now, return a mock error response that fits the schema.
    return {
        perQuestion: input.questions.map(() => ({
            marks: 0,
            feedback: "Evaluation failed. Please try again."
        })),
        totalScore: 0,
        percentage: 0,
        improvementAdvice: "Could not evaluate the exam due to an error. Please try submitting again.",
        weakAreas: ["System Error"]
    };
  }
}
