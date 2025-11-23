// app/api/evaluate-exam/route.ts
import { NextResponse } from "next/server";
import { evaluateWrittenExamGenkit } from "../../../lib/genkit";

export async function POST(req: Request) {
  const body = await req.json();
  // body: { examId, questions, answers, studentInfo }
  try {
    const result = await evaluateWrittenExamGenkit(body);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: "Evaluation failed", details: error }, { status: 500 });
  }
}
