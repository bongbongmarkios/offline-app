// This is an AI-powered function to suggest related content (readings, hymns) based on user activity.
'use server';

/**
 * @fileOverview AI agent for suggesting related content based on user activity.
 *
 * - suggestRelatedContent - A function that suggests related content.
 * - SuggestRelatedContentInput - The input type for the suggestRelatedContent function.
 * - SuggestRelatedContentOutput - The return type for the suggestRelatedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedContentInputSchema = z.object({
  recentProgramItems: z
    .array(z.string())
    .describe('List of recently viewed program item titles.'),
  recentHymns: z.array(z.string()).describe('List of recently read hymn titles.'),
  recentReadings: z
    .array(z.string())
    .describe('List of recently explored responsive reading titles.'),
});
export type SuggestRelatedContentInput = z.infer<typeof SuggestRelatedContentInputSchema>;

const SuggestRelatedContentOutputSchema = z.object({
  suggestedReadings: z
    .array(z.string())
    .describe('List of suggested responsive reading titles.'),
  suggestedHymns: z.array(z.string()).describe('List of suggested hymn titles.'),
  reasoning: z.string().describe('Explanation for why the content is suggested.'),
});
export type SuggestRelatedContentOutput = z.infer<typeof SuggestRelatedContentOutputSchema>;

export async function suggestRelatedContent(input: SuggestRelatedContentInput): Promise<SuggestRelatedContentOutput> {
  return suggestRelatedContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedContentPrompt',
  input: {schema: SuggestRelatedContentInputSchema},
  output: {schema: SuggestRelatedContentOutputSchema},
  prompt: `Based on the user's recent activity, suggest related readings and hymns.

Recent Program Items: {{#each recentProgramItems}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Recent Hymns: {{#each recentHymns}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Recent Readings: {{#each recentReadings}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Consider themes, complementary messages, and authors when making suggestions.
Explain why each suggestion is valuable. Be brief, use one sentence to explain why the recommendation is valuable.

Output in the following JSON format:
{
  "suggestedReadings": ["Title 1", "Title 2"],
  "suggestedHymns": ["Hymn 1", "Hymn 2"],
  "reasoning": "Brief explanation for the suggestions."
}
`,
});

const suggestRelatedContentFlow = ai.defineFlow(
  {
    name: 'suggestRelatedContentFlow',
    inputSchema: SuggestRelatedContentInputSchema,
    outputSchema: SuggestRelatedContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
