'use server';

import { explainTopic, type ExplainTopicOutput } from '@/ai/flows/explain-topic';
import { textToSpeech, type TextToSpeechInput, type TextToSpeechOutput } from '@/ai/flows/text-to-speech';
import { voiceInput, type VoiceInput } from '@/ai/flows/voice-input';
import { getCreatorInstagram } from '@/ai/flows/get-creator-instagram';

// This function now directly returns the output from the Genkit flow,
// as the flow itself is designed to handle all logic, including creator info.
export async function getAiTutorExplanation(topic: string): Promise<ExplainTopicOutput> {
  try {
    const result = await explainTopic({ topic });
    // The flow now correctly returns the uiAction, so no special handling is needed here.
    return result;
  } catch (error) {
    console.error("Error in getAiTutorExplanation:", error);
    // Return a user-friendly error message if the flow fails.
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
        // Return an empty audioUrl to indicate failure, which the client can handle.
        return {
            audioUrl: '',
        }
    }
}

// The input for voiceInput is a data URI string, not an object.
export async function getVoiceInput(audioDataUri: string) {
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
