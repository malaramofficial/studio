'use server';

import { explainTopic, type ExplainTopicOutput } from '@/ai/flows/explain-topic';
import { textToSpeech, type TextToSpeechInput, type TextToSpeechOutput } from '@/ai/flows/text-to-speech';
import { voiceInput, type VoiceInput, type VoiceInputOutput } from '@/ai/flows/voice-input';
import { getCreatorInstagram } from '@/ai/flows/get-creator-instagram';


export async function getAiTutorExplanation(topic: string): Promise<ExplainTopicOutput> {
  const asksForInstagram = /(instagram|insta)/i.test(topic);

  if (asksForInstagram) {
    const instaInfo = await getCreatorInstagram();
    return {
      explanation: "आप यहाँ क्लिक करके निर्माता के Instagram प्रोफ़ाइल पर जा सकते हैं:",
      uiAction: instaInfo.uiAction,
    };
  }

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

export async function getTextToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    try {
        const result = await textToSpeech(input);
        return result;
    } catch (error) {
        console.error("Error in getTextToSpeech:", error);
        return {
            audioUrl: '',
        }
    }
}

export async function getVoiceInput(audioDataUri: string): Promise<VoiceInputOutput> {
    try {
        const result = await voiceInput({ audioDataUri });
        return result;
    } catch (error) {
        console.error("Error in getVoiceInput:", error);
        return {
            text: "माफ़ कीजिए, मैं आपकी आवाज़ को समझ नहीं पाया।",
        }
    }
}
