"use server";

import { generateText } from "@/lib/gemini";

export async function evaluateWrittenExam({ questions, answers }) {
  const prompt = `
आप RBSE कक्षा 12 के हिंदी परीक्षक हैं।

Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}

JSON ONLY आउटपुट दें:
{
 "perQuestion": [
   { "id": "q1", "marksObtained": 4, "maxMarks": 5, "feedback": "..." }
 ],
 "totalScore": 80,
 "percentage": 80,
 "advice": "..."
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
