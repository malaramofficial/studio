"use server";

import { generateText } from "@/lib/gemini";

export async function explainTopic({ stream, subject, chapter }) {
  const prompt = `
आप RBSE कक्षा 12 हिंदी माध्यम के ट्यूटर हैं।
100% हिंदी में समझाइए:

स्ट्रीम: ${stream}
विषय: ${subject}
अध्याय: ${chapter}

फॉर्मेट:
1) छोटा परिचय
2) 3-5 मुख्य बिंदु
3) आसान उदाहरण
4) 1 अभ्यास प्रश्न
`;

  const res = await generateText(prompt);

  if (!res.ok || !res.text) {
    return "विषय को समझाने में एक त्रुटि हुई। कृपया पुनः प्रयास करें।";
  }

  return res.text;
}
