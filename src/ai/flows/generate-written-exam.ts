"use server";

import { generateText } from "@/lib/gemini";

export async function generateWrittenExamV2({ subject }) {
  const prompt = `
Hindi Medium आधुनिक पैटर्न का RBSE Class 12 पेपर बनाइए।
JSON ONLY return करें:

{
 "questions": [
   { "id": "q1", "type": "short", "question": "...", "marks": 4 },
   { "id": "q2", "type": "long", "question": "...", "marks": 8 }
 ]
}
`;

  const res = await generateText(prompt);
  if (!res.ok || !res.text) return { ok: false };

  try {
    const t = res.text.trim();
    return JSON.parse(t.slice(t.indexOf("{")));
  } catch {
    return { ok: false, raw: res.text };
  }
}
