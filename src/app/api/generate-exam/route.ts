// app/api/generate-exam/route.ts
import { NextResponse } from "next/server";
import { generateWrittenExamGenkit } from "../../../lib/genkit";

export async function POST(req: Request) {
  const body = await req.json();
  // body: { stream, subject, chapters, durationMinutes, totalMarks }
  try {
    const exam = await generateWrittenExamGenkit(body);
    return NextResponse.json({ ok: true, exam });
  } catch (err) {
    console.error(err);
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: "Exam generation failed", details: error }, { status: 500 });
  }
}
