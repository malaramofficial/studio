"use server";

import { explainTopic } from "@/ai/flows/explain-topic";

export async function getAiTutorExplanation(topic: string) {
  try {
    const result = await explainTopic({ topic });
    return result.explanation;
  } catch (error) {
    console.error("Error in getAiTutorExplanation:", error);
    return "माफ़ कीजिए, मुझे इस विषय को समझाने में कुछ कठिनाई हो रही है। कृपया पुनः प्रयास करें।";
  }
}
