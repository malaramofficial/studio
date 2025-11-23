// lib/genkit.ts (server-side)
'use server';

import { generateWrittenExamV2 } from "@/ai/flows/generate-written-exam-v2";
import type { GenerateWrittenExamOutputV2, QuestionSchema as GenkitQuestion } from "@/ai/flows/generate-written-exam-v2";
import { evaluateWrittenExam as evaluateExamFlow } from '@/ai/flows/evaluate-written-exam';
import type { EvaluateWrittenExamOutput, EvaluateWrittenExamInput } from '@/aiflows/evaluate-written-exam';

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

function transformGenkitQuestionToExamQuestion(q: GenkitQuestion, index: number) {
    // Crude section logic based on index for now
    let section = 'A';
    if (index > 5) section = 'B';
    if (index > 10) section = 'C';

    return {
        id: `q${index + 1}`,
        section: section,
        marks: 5, // Placeholder marks
        questionText: q.question,
        type: q.type,
        options: q.options,
        answer: q.answer
    };
}


// These functions should run on server (Next.js route handlers).
export async function generateWrittenExamGenkit(payload: {
  stream: string; // stream is not used by the flow but let's keep it
  subject: string;
  chapters: string[];
  durationMinutes: number;
  totalMarks?: number;
}): Promise<GeneratedExam> {
  const result: GenerateWrittenExamOutputV2 = await generateWrittenExamV2({
      subject: payload.subject,
      chapters: payload.chapters,
      marks: payload.totalMarks || 100,
      durationMinutes: payload.durationMinutes,
  });

  return {
    examId: "exam_" + Date.now(),
    title: `${result.exam.subject} - Sample Paper`,
    durationMinutes: payload.durationMinutes,
    totalMarks: payload.totalMarks ?? 100,
    questions: result.exam.questions.map(transformGenkitQuestionToExamQuestion),
  };
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
    
    // The flow output matches the client expectation, but we need to add IDs back
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
