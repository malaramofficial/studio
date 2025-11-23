// app/api/evaluate-exam/route.ts
import { NextResponse } from "next/server";
import { evaluateWrittenExamGenkit } from "../../../lib/genkit";

type EvaluationPayload = {
  examId: string;
  questions: { id: string; questionText: string; maxMarks: number }[];
  answers: { id: string; answerText: string }[];
  studentInfo?: { uid?: string; name?: string };
};


export async function POST(req: Request) {
  try {
    const body: EvaluationPayload = await req.json();

    if (!body.examId || !body.questions || !body.answers) {
         return NextResponse.json({ ok: false, error: "Missing required fields: examId, questions, answers." }, { status: 400 });
    }

    const result = await evaluateWrittenExamGenkit(body);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[API/EVALUATE-EXAM] Error:", err);
    const error = err instanceof Error ? err.message : "An unknown error occurred during evaluation.";
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
