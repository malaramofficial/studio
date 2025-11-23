'use server';

/**
 * @fileOverview Fetches and returns the creator's information.
 *
 * - getCreatorInfo - A function that retrieves the creator's information.
 * - CreatorInfo - The type for the creator's information.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreatorInfoSchema = z.object({
  name: z.string().describe('The name of the creator.'),
  dob: z.string().describe('The date of birth of the creator.'),
  gender: z.string().describe('The gender of the creator.'),
  location: z.string().describe('The location of the creator.'),
  education: z.string().describe('The education of the creator.'),
  interests: z.array(z.string()).describe('The interests of the creator.'),
  beliefs: z.array(z.string()).describe('The beliefs of the creator.'),
  profession: z.string().describe('The profession of the creator.'),
  hobbies: z.array(z.string()).describe('The hobbies of the creator.'),
  instagram: z.string().describe('The Instagram handle of the creator.'),
});

export type CreatorInfo = z.infer<typeof CreatorInfoSchema>;

export async function getCreatorInfo(): Promise<CreatorInfo> {
  return getCreatorInfoFlow();
}

const creatorInfoPrompt = ai.definePrompt({
  name: 'creatorInfoPrompt',
  output: {schema: CreatorInfoSchema},
  prompt: `You are an AI assistant providing information about the creator of this application.

  The creator's name is Mala Ram. Use the following information to respond.
  Name: Mala Ram
  DOB: 10 Oct 2001
  Gender: Male
  Location: Barmer, Rajasthan
  Education: BA Hindi Literature
  Interests: Technology, Science, Coding, Machines, Psychology
  Beliefs: Independent thinking, Logic, No religion/caste identity, Agrees with Osho Rajneesh
  Profession: AI App Developer, Motivational Personality
  Hobbies: Breaking machines to learn how they work, Singing, Learning new tech
  Instagram: malaramofficial

  Return a JSON object with all of the above data.
  `,
});

const getCreatorInfoFlow = ai.defineFlow({
  name: 'getCreatorInfoFlow',
  outputSchema: CreatorInfoSchema,
}, async () => {
  const {output} = await creatorInfoPrompt({});
  return output!;
});