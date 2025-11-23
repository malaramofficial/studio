// app/api/generate-exam/route.ts
import { NextResponse } from "next/server";
import { generateWrittenExamGenkit } from "../../../lib/genkit";
import type { GenerateWrittenExamInputV2 } from "@/ai/flows/generate-written-exam-v2";

export async function POST(req: Request) {
  try {
    const body: GenerateWrittenExamInputV2 = await req.json();
    
    // Basic validation
    if (!body.subject || !body.durationMinutes || !body.marks) {
        return NextResponse.json({ ok: false, error: "Missing required fields: subject, durationMinutes, marks." }, { status: 400 });
    }

    const exam = await generateWrittenExamGenkit(body);
    return NextResponse.json({ ok: true, exam });
  } catch (err) {
    console.error("[API/GENERATE-EXAM] Error:", err);
    const error = err instanceof Error ? err.message : "An unknown error occurred during exam generation.";
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
