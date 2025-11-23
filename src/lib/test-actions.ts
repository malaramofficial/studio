"use server";

import { evaluateWrittenExam as evalExam, type EvaluateWrittenExamInput, type EvaluateWrittenExamOutput } from "@/ai/flows/evaluate-written-exam";

export async function evaluateWrittenExam(input: EvaluateWrittenExamInput): Promise<EvaluateWrittenExamOutput> {
  try {
    const result = await evalExam(input);
    return result;
  } catch (error) {
    console.error("Error in evaluateWrittenExam:", error);
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
