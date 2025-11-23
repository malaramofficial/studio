'use server';

/**
 * @fileOverview Returns the creator's Instagram handle and a redirect URL.
 *
 * - getCreatorInstagram - A function that returns the creator's Instagram information.
 * - GetCreatorInstagramOutput - The return type for the getCreatorInstagram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCreatorInstagramOutputSchema = z.object({
  handle: z.string().describe('The creator Instagram handle.'),
  redirectUrl: z.string().describe('The URL to redirect to.'),
  uiAction: z.enum(['SHOW_REDIRECT_BUTTON']).describe('The UI action to perform.'),
});

export type GetCreatorInstagramOutput = z.infer<typeof GetCreatorInstagramOutputSchema>;

export async function getCreatorInstagram(): Promise<GetCreatorInstagramOutput> {
  return getCreatorInstagramFlow();
}

const getCreatorInstagramFlow = ai.defineFlow({
    name: 'getCreatorInstagramFlow',
    outputSchema: GetCreatorInstagramOutputSchema,
  },
  async () => {
    return {
      handle: 'malaramofficial',
      redirectUrl: 'https://instagram.com/malaramofficial',
      uiAction: 'SHOW_REDIRECT_BUTTON',
    };
  }
);
