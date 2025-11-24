'"use server";

import { generateText } from "@/lib/gemini";

export async function generateWrittenExam({ subject, chapter }) {
  const prompt = `
RBSE Class 12 Hindi Medium के लिए परीक्षा पेपर बनाइए।

विषय: ${subject}
अध्याय: ${chapter}

JSON ONLY:
{
 "questions": [
   { "id": "q1", "question": "...", "marks": 5 },
   { "id": "q2", "question": "...", "marks": 5 }
 ]
}
`;

  const res = await generateText(prompt);
  if (!res.ok || !res.text) return { ok: false };

  try {
    const text = res.text.trim();
    const obj = JSON.parse(text.slice(text.indexOf("{")));
    return { ok: true, ...obj };
  } catch {
    return { ok: false, raw: res.text };
  }
}
