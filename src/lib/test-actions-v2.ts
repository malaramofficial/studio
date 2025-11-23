"use server";

import { generateWrittenExam as genExam, type GenerateWrittenExamInput } from "@/ai/flows/generate-written-exam";

// This is a simplified output for the new, stable architecture
type ExamOutput = {
    questions: string[];
}

export async function generateWrittenExam(input: GenerateWrittenExamInput): Promise<ExamOutput> {
  try {
    const result = await genExam(input);
    // The new flow directly returns an array of strings
    if (!result || !Array.isArray(result) || result.length === 0) {
        throw new Error("AI failed to return valid questions.");
    }
    return { questions: result };
  } catch (error) {
    console.error("Error in generateWrittenExam (simplified):", error);
    // Return an empty array on failure, which the UI can handle.
    return {
      questions: []
    };
  }
}
