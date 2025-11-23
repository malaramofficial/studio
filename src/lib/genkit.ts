'use server';

import { generateWrittenExamV2, type GenerateWrittenExamInputV2 } from "@/ai/flows/generate-written-exam-v2";
import { evaluateWrittenExam as evaluateExamFlow, type EvaluateWrittenExamInput, type EvaluateWrittenExamOutput } from '@/ai/flows/evaluate-written-exam';

// Define the shape of the exam as the client expects it.
export type GeneratedExam = {
  examId: string;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  questions: {
    id: string;
    marks: number;
    questionText: string;
    type: 'long' | 'short' | 'mcq';
    options?: string[];
    answer?: string;
  }[];
};

export type EvaluationResult = EvaluateWrittenExamOutput & {
    perQuestion: (EvaluateWrittenExamOutput['perQuestion'][number] & {
        id: string;
        maxMarks: number;
        marksObtained: number;
    })[]
};

// Helper function to assign marks based on question type. This can be improved.
function assignQuestionMetadata(questionType: 'long' | 'short' | 'mcq') {
    // A simple logic for marks distribution
    if (questionType === 'long') return { marks: 10 };
    if (questionType === 'mcq') return { marks: 2 };
    return { marks: 5 }; // Default for short
}

// This function now robustly wraps the Genkit flow for exam generation.
export async function generateWrittenExamGenkit(payload: GenerateWrittenExamInputV2): Promise<GeneratedExam> {
  console.log("Calling Genkit to generate exam with payload:", payload);
  try {
    const result = await generateWrittenExamV2(payload);

    if (result.status !== 'success' || !result.exam || !Array.isArray(result.exam.questions) || result.exam.questions.length === 0) {
      throw new Error("Invalid or empty response structure from Genkit flow.");
    }

    console.log(`Genkit returned ${result.exam.questions.length} questions.`);

    const transformedQuestions = result.exam.questions.map((q, index) => {
        const { marks } = assignQuestionMetadata(q.type);
        return {
            id: `q_${index + 1}`, // More human-readable ID
            marks,
            questionText: q.question,
            type: q.type,
            options: q.options,
            answer: q.answer,
        };
    });
    
    const totalMarks = transformedQuestions.reduce((sum, q) => sum + q.marks, 0);

    return {
      examId: "exam_" + Date.now(),
      title: `${result.exam.subject} - ${result.exam.stream}`,
      durationMinutes: payload.durationMinutes,
      totalMarks: totalMarks, // Use calculated total marks for consistency
      questions: transformedQuestions,
    };
  } catch (error) {
    console.error("Error in generateWrittenExamGenkit:", error);
    // Rethrow the error to be handled by the API route
    throw new Error("Failed to generate exam paper from AI model.");
  }
}


// This function now robustly wraps the Genkit flow for exam evaluation.
export async function evaluateWrittenExamGenkit(payload: {
  examId: string;
  questions: { id: string; questionText: string; maxMarks: number }[];
  answers: { id: string; answerText: string }[];
}): Promise<EvaluationResult> {
    console.log("Calling Genkit to evaluate exam for examId:", payload.examId);
    
    if (!payload.questions || payload.questions.length === 0) {
        throw new Error("No questions provided for evaluation.");
    }

    const evaluationInput: EvaluateWrittenExamInput = {
        // Ensure we only send the text, as defined in the flow
        questions: payload.questions.map(q => q.questionText),
        answers: payload.answers.map(a => a.answerText),
    };
  
    try {
        const result = await evaluateExamFlow(evaluationInput);

        if (!result || !Array.isArray(result.perQuestion) || result.perQuestion.length !== payload.questions.length) {
            throw new Error("Invalid response structure from evaluation flow.");
        }

        const perQuestionWithId = result.perQuestion.map((pq, index) => {
            const originalQuestion = payload.questions[index];
            return {
                ...pq,
                id: originalQuestion.id,
                maxMarks: originalQuestion.maxMarks,
                marksObtained: pq.marks, 
            };
        });

        return {
            ...result,
            perQuestion: perQuestionWithId,
        };

    } catch (error) {
         console.error("Error in evaluateWrittenExamGenkit:", error);
         // Rethrow the error to be handled by the API route
         throw new Error("Failed to evaluate exam paper with AI model.");
    }
}
