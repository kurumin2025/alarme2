'use server';

/**
 * @fileOverview Provides AI-driven sleep sound suggestions based on user preferences.
 *
 * - suggestSleepSound -  The function that orchestrates the sleep sound analysis and suggestion process.
 * - SuggestSleepSoundInput - The input type for the suggestSleepSound function.
 * - SuggestSleepSoundOutput - The return type for the suggestSleepSound function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSleepSoundInputSchema = z.object({
  selectedWakeUpSound: z
    .string()
    .describe(
      'The name of the selected wake-up sound, e.g., "Gentle Morning Bells".'
    ),
});
export type SuggestSleepSoundInput = z.infer<typeof SuggestSleepSoundInputSchema>;

const SuggestSleepSoundOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'An analysis of the selected wake-up sound and suggestions for optimizing sound choices to improve sleep quality.'
    ),
});
export type SuggestSleepSoundOutput = z.infer<typeof SuggestSleepSoundOutputSchema>;

export async function suggestSleepSound(input: SuggestSleepSoundInput): Promise<SuggestSleepSoundOutput> {
  return suggestSleepSoundFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSleepSoundPrompt',
  input: {schema: SuggestSleepSoundInputSchema},
  output: {schema: SuggestSleepSoundOutputSchema},
  prompt: `You are a sleep sound expert. Analyze the user's selected wake-up sound and provide personalized suggestions for optimizing their sound choices to enhance sleep quality.

  Selected Wake-Up Sound: {{{selectedWakeUpSound}}}

  Consider factors such as sound frequency, volume, and overall calming effect. Offer specific alternative sound options and explain why they might be more effective for promoting restful sleep.  Explain the reasons behind the suggestions.
  `,
});

const suggestSleepSoundFlow = ai.defineFlow(
  {
    name: 'suggestSleepSoundFlow',
    inputSchema: SuggestSleepSoundInputSchema,
    outputSchema: SuggestSleepSoundOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
