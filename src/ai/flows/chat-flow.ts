
'use server';
/**
 * @fileOverview A Genkit flow for basic chat with Gemini.
 *
 * - chatWithGemini - A function that takes a user prompt and returns Gemini's response.
 * - ChatInput - The type for the input.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  prompt: z.string().describe('The user message to send to the AI.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// For this simple chat, we'll directly return a string.
// If structured output was needed, we'd define an output schema.
// export const ChatOutputSchema = z.object({
//   response: z.string().describe('The AI model\'s response.'),
// });
// export type ChatOutput = z.infer<typeof ChatOutputSchema>;


export async function chatWithGemini(input: ChatInput): Promise<string> {
  // This flow directly calls ai.generate and returns the text.
  // For more complex scenarios, you might use ai.defineFlow and ai.definePrompt.
  
  const { text } = await ai.generate({
    prompt: input.prompt,
    // You can add model, config (like safetySettings) if needed here,
    // otherwise it uses the default from genkit.ts
  });
  return text;
}

// Example of how you might structure it with ai.defineFlow and ai.definePrompt if needed:
/*
const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  // output: { schema: ChatOutputSchema }, // If using structured output
  prompt: `{{prompt}}`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    // outputSchema: ChatOutputSchema, // If using structured output
  },
  async (input) => {
    // const { output } = await chatPrompt(input);
    // return output!; // If using structured output

    const result = await chatPrompt(input);
    return result.text; // If returning string directly
  }
);

export async function chatWithGemini(input: ChatInput): Promise<string> {
  return chatFlow(input);
}
*/
