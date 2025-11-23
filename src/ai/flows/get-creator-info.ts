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
  role: z.string().describe('The role of the creator in the app.'),
  instagram: z.string().describe('The Instagram handle of the creator.'),
  dob: z.string().describe('The date of birth of the creator.'),
  gender: z.string().describe('The gender of the creator.'),
  location: z.string().describe('The location of the creator.'),
  education: z.string().describe('The education of the creator.'),
  interests: z.array(z.string()).describe('The interests of the creator.'),
  beliefs: z.array(z.string()).describe('The beliefs of the creator.'),
  profession: z.string().describe('The profession of the creator.'),
  hobbies: z.array(z.string()).describe('The hobbies of the creator.'),
});

export type CreatorInfo = z.infer<typeof CreatorInfoSchema>;

export async function getCreatorInfo(): Promise<CreatorInfo> {
  return getCreatorInfoFlow();
}

const getCreatorInfoFlow = ai.defineFlow({
  name: 'getCreatorInfoFlow',
  outputSchema: CreatorInfoSchema,
}, async () => {
    // This data is now static and does not require an API call.
    return {
        name: 'Mala Ram',
        role: 'Developer, Designer, Idea Owner',
        instagram: 'malaramofficial',
        dob: '10 Oct 2001',
        gender: 'Male',
        location: 'Barmer, Rajasthan',
        education: 'BA Hindi Literature',
        interests: ['Technology', 'Science', 'Coding', 'Machines', 'Psychology'],
        beliefs: ['Independent thinking', 'Logic', 'No religion/caste identity', 'Agrees with Osho Rajneesh'],
        profession: 'AI App Developer, Motivational Personality',
        hobbies: ['Breaking machines to learn how they work', 'Singing', 'Learning new tech'],
    };
});
