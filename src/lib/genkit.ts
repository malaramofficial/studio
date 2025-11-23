// lib/genkit.ts (server-side)
'use server';

import { generateWrittenExamV2 } from "@/ai/flows/generate-written-exam-v2";
import type { GenerateWrittenExamOutputV2 } from "@/ai/flows/generate-written-exam-v2";
import { evaluateWrittenExam as evaluateExamFlow } from '@/ai/flows/evaluate-written-exam';
import type { EvaluateWrittenExamOutput, EvaluateWrittenExamInput } from '@/ai/flows/evaluate-written-exam';

// Re-typing to match the client component's expectation, creating a separation layer.
export type GeneratedExam = {
  examId: string;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  questions: {
    id: string;
    section: string; // Section is not in Genkit output, we can add it or make it default
    marks: number; // marks is not in Genkit output, we can add it or make it default
    questionText: string;
    type: 'long' | 'short' | 'mcq';
    options?: string[];
    answer?: string;
  }[];
};

export type EvaluationResult = EvaluateWrittenExamOutput;

function transformGenkitQuestionToExamQuestion(q: any, index: number) {
    // Crude section logic based on index for now
    let section = 'A';
    if (index > 5) section = 'B';
    if (index > 10) section = 'C';

    // Assign marks based on question type
    let marks = 5;
    if (q.type === 'long') marks = 10;
    if (q.type === 'mcq') marks = 2;


    return {
        id: `q${index + 1}`,
        section: section,
        marks: marks, 
        questionText: q.question,
        type: q.type,
        options: q.options,
        answer: q.answer
    };
}


export async function generateWrittenExamGenkit(payload: {
  stream: string;
  subject: string;
  chapters: string[];
  durationMinutes: number;
  totalMarks?: number;
}): Promise<GeneratedExam> {
  try {
      const result: GenerateWrittenExamOutputV2 = await generateWrittenExamV2({
          subject: payload.subject,
          chapters: payload.chapters,
          marks: payload.totalMarks || 100,
          durationMinutes: payload.durationMinutes,
      });

      if (!result || !result.exam) {
        throw new Error("Invalid response from exam generation flow");
      }

      return {
        examId: "exam_" + Date.now(),
        title: `${result.exam.subject} - Sample Paper`,
        durationMinutes: payload.durationMinutes,
        totalMarks: payload.totalMarks ?? 100,
        questions: result.exam.questions.map(transformGenkitQuestionToExamQuestion),
      };
  } catch (error) {
      console.error("Error in generateWrittenExamGenkit, returning placeholder:", error);
      // Fallback to placeholder if Genkit fails
      return {
        examId: "exam_" + Date.now(),
        title: `${payload.subject} - Sample Paper (Fallback)`,
        durationMinutes: payload.durationMinutes,
        totalMarks: payload.totalMarks ?? 100,
        questions: [
          { id: "q1", section: "A", marks: 5, type: 'short', questionText: "Define electric field with example." },
          { id: "q2", section: "A", marks: 5, type: 'short', questionText: "State Ohm's law." },
          { id: "q3", section: "B", marks: 10, type: 'long', questionText: "Explain electromagnetic induction with diagram." },
          { id: "q4", section: "C", marks: 15, type: 'long', questionText: "Describe photoelectric effect and its applications." },
        ],
      };
  }
}

export async function evaluateWrittenExamGenkit(payload: {
  examId: string;
  questions: { id: string; questionText: string; maxMarks: number }[];
  answers: { id: string; answerText: string }[];
  studentInfo?: { uid?: string; name?: string };
}): Promise<EvaluationResult> {
    const evaluationInput: EvaluateWrittenExamInput = {
        questions: payload.questions.map(q => q.questionText),
        answers: payload.answers.map(a => a.answerText),
    };
  
    const result = await evaluateExamFlow(evaluationInput);
    
    const perQuestionWithId = result.perQuestion.map((pq, index) => ({
        ...pq,
        id: payload.questions[index].id,
        maxMarks: payload.questions[index].maxMarks,
        marksObtained: pq.marks,
    }));

    return {
        ...result,
        perQuestion: perQuestionWithId,
    };
}
