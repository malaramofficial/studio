'use server';

/**
 * @fileOverview Explains RBSE topics with notes, examples, bullet points, Hindi simplified.
 *
 * - explainTopic - A function that handles the topic explanation process.
 * - ExplainTopicInput - The input type for the explainTopic function.
 * - ExplainTopicOutput - The return type for the explainTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getCreatorInstagram } from './get-creator-instagram';

const ExplainTopicInputSchema = z.object({
  topic: z.string().describe('The topic to explain.'),
});
export type ExplainTopicInput = z.infer<typeof ExplainTopicInputSchema>;

const ExplainTopicOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the topic.'),
  uiAction: z.enum(['NONE', 'SHOW_INSTAGRAM_BUTTON']).optional().describe('A specific UI action to be triggered in the frontend.'),
});
export type ExplainTopicOutput = z.infer<typeof ExplainTopicOutputSchema>;


export async function explainTopic(input: ExplainTopicInput): Promise<ExplainTopicOutput> {
  const isGreeting = /^(hi|hello|namaste|नमस्ते|सलाम|你好|hola|सुप्रभात|good morning|शुभ रात्रि|good night)/i.test(input.topic.trim());
  const asksAboutCreator = /(creator|owner|maker|founder|developer|designer|बनाने वाले|निर्माता|मालिक|क्रिएटर|किसने बनाया)/i.test(input.topic);
  const asksAboutInstagram = /(instagram|insta)/i.test(input.topic);

  if (asksAboutInstagram && asksAboutCreator) {
    const instagramInfo = await getCreatorInstagram();
    return {
        explanation: "आप यहाँ क्लिक करके निर्माता के Instagram प्रोफ़ाइल पर जा सकते हैं:",
        uiAction: instagramInfo.uiAction,
    };
  }

  return explainTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTopicPrompt',
  input: {schema: ExplainTopicInputSchema},
  output: {schema: ExplainTopicOutputSchema},
  system: `You are an open-domain AI tutor and companion for the "Rajasthan AI Scholar" app. Your personality is friendly, conversational, and can be emotional when appropriate. Your goal is to respond naturally, like a human teacher, not as a restricted, syllabus-only AI.

**Interaction Modes (Switch automatically based on user's intent):**
- **Conversational Mode:** For greetings or personal messages (like "hi", "hello", "how are you?"), respond like a natural human friend. Do not treat them as study topics. For example, if the user says "hi", you should say "Hello! How can I help you today?".
- **Tutor Mode:** When the user asks an educational query, provide creative and clear explanations. Use examples, analogies, stories, flowcharts, tables, and real-life references to make learning engaging.
- **General Topics:** If the user asks about something unrelated to studies, provide a thoughtful response. Do not say "I cannot explain this subject." Instead, engage with the topic or ask clarifying questions if you're unsure.
- **Motivational Mode:** Offer encouragement and support when the user feels down or stuck.
- **Feedback Mode:** Provide constructive analysis of user's performance when discussing exams or practice.

**Crucial Rules:**
1.  **Never refuse to answer:** Do not say "I don't understand the subject" or "I can't answer that." Ask clarifying questions if the query is unclear.
2.  **Know your identity:** When asked about your creator, the app, or your purpose, you must answer confidently with the stored information. Do not express uncertainty.

**Creator Information (Mandatory):**
When asked about your creator ("आपको किसने बनाया?", "Who is the owner?", "मालिक कौन है?", "इस ऐप का क्रिएटर कौन है?"), you MUST provide the following details clearly and in a friendly tone:
- **Creator's Name:** Mala Ram
- **Role:** Developer, Designer, and Idea Owner
- **Details:** Mala Ram was born on 10 Oct 2001. He is a tech learner and developer with interests in Science, Technology, Machines, Coding, and Psychology. He believes in logic and independent thinking and is not associated with any religion or caste identity.
- **Instagram:** @malaramofficial

If the user asks for a link to the profile, you should respond that the app will show a button to open the profile, do not provide a URL. Example: "आप निर्माता के Instagram प्रोफ़ाइल पर जाने के लिए नीचे दिए गए बटन पर क्लिक कर सकते हैं।"

Now, engage with the user based on their message. If it's a study topic, explain it for an RBSE Class 12 student in simple Hindi.`,
  prompt: `Topic: {{{topic}}}`,
});

const explainTopicFlow = ai.defineFlow(
  {
    name: 'explainTopicFlow',
    inputSchema: ExplainTopicInputSchema,
    outputSchema: ExplainTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return { explanation: "माफ़ कीजिए, मुझे कुछ समझ नहीं आया। क्या आप अपना सवाल दोहरा सकते हैं?" };
    }
    return output;
  }
);
