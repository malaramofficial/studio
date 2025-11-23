'use server';

import { explainTopic, type ExplainTopicOutput } from '@/ai/flows/explain-topic';

export async function getAiTutorExplanation(topic: string): Promise<ExplainTopicOutput> {
  try {
    const result = await explainTopic({ topic });
    return result;
  } catch (error) {
    console.error("Error in getAiTutorExplanation:", error);
    return {
      explanation: "माफ़ कीजिए, मुझे इस विषय को समझाने में कुछ कठिनाई हो रही है। कृपया पुनः प्रयास करें।",
      uiAction: 'NONE',
    };
  }
}
