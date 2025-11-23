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

// Helper function to assign marks. This can be improved.
function assignQuestionMetadata(questionType: 'long' | 'short' | 'mcq') {
    let marks = 5; // Default for short
    if (questionType === 'long') marks = 10;
    if (questionType === 'mcq') marks = 2;
    
    return { marks };
}

// Wrapper for the Genkit flow to generate an exam.
export async function generateWrittenExamGenkit(payload: GenerateWrittenExamInputV2): Promise<GeneratedExam> {
  console.log("Calling Genkit to generate exam with payload:", payload);
  try {
    const result = await generateWrittenExamV2(payload);

    if (result.status !== 'success' || !result.exam || !Array.isArray(result.exam.questions)) {
      throw new Error("Invalid response structure from Genkit flow.");
    }

    console.log(`Genkit returned ${result.exam.questions.length} questions.`);

    const transformedQuestions = result.exam.questions.map((q, index) => {
        const { marks } = assignQuestionMetadata(q.type);
        return {
            id: `q_${index}`,
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
      totalMarks: totalMarks,
      questions: transformedQuestions,
    };
  } catch (error) {
    console.error("Error in generateWrittenExamGenkit:", error);
    throw new Error("Failed to generate exam paper from AI model.");
  }
}


// Wrapper for the Genkit flow to evaluate an exam.
export async function evaluateWrittenExamGenkit(payload: {
  examId: string;
  questions: { id: string; questionText: string; maxMarks: number }[];
  answers: { id: string; answerText: string }[];
}): Promise<EvaluationResult> {
    console.log("Calling Genkit to evaluate exam for examId:", payload.examId);
    
    const evaluationInput: EvaluateWrittenExamInput = {
        questions: payload.questions.map(q => q.questionText),
        answers: payload.answers.map(a => a.answerText),
    };
  
    try {
        const result = await evaluateExamFlow(evaluationInput);

        if (!result || !Array.isArray(result.perQuestion)) {
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
         throw new Error("Failed to evaluate exam paper with AI model.");
    }
}
