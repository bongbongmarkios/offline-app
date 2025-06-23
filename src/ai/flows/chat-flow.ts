'use server';
/**
 * @fileOverview A Genkit flow for basic chat with Gemini, with a tool for finding lyrics.
 *
 * - chatWithGemini - A function that takes a user prompt and returns Gemini's response.
 * - ChatInput - The type for the input.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { initialSampleHymns } from '@/data/hymns';

// Tool to find hymn lyrics
const findHymnLyrics = ai.defineTool(
    {
        name: 'findHymnLyrics',
        description: "Searches the app's local database for a Christian hymn based on a query. The query can be a title, author, or a line from the lyrics. Searches English, Hiligaynon, and Filipino fields.",
        inputSchema: z.object({
            query: z.string().describe('The title, author, or a line of lyrics from the hymn to search for.'),
        }),
        outputSchema: z.object({
            found: z.boolean(),
            title: z.string().optional(),
            lyrics: z.string().optional(),
            language: z.string().optional(),
            author: z.string().optional(),
        }),
    },
    async ({ query }) => {
        const lowerCaseQuery = query.toLowerCase().trim();
        if (!lowerCaseQuery) {
          return { found: false };
        }
        
        for (const h of initialSampleHymns) {
            // Check titles
            if (h.titleEnglish.toLowerCase().includes(lowerCaseQuery)) {
                return { found: true, title: h.titleEnglish, lyrics: h.lyricsEnglish, language: 'English', author: h.author };
            }
            if (h.titleHiligaynon.toLowerCase().includes(lowerCaseQuery)) {
                return { found: true, title: h.titleHiligaynon, lyrics: h.lyricsHiligaynon, language: 'Hiligaynon', author: h.author };
            }
            if (h.titleFilipino?.toLowerCase().includes(lowerCaseQuery)) {
                return { found: true, title: h.titleFilipino, lyrics: h.lyricsFilipino, language: 'Filipino', author: h.author };
            }

            // Check lyrics
            if (h.lyricsEnglish.toLowerCase().includes(lowerCaseQuery)) {
                return { found: true, title: h.titleEnglish, lyrics: h.lyricsEnglish, language: 'English', author: h.author };
            }
            if (h.lyricsHiligaynon.toLowerCase().includes(lowerCaseQuery)) {
                return { found: true, title: h.titleHiligaynon, lyrics: h.lyricsHiligaynon, language: 'Hiligaynon', author: h.author };
            }
            if (h.lyricsFilipino?.toLowerCase().includes(lowerCaseQuery)) {
                return { found: true, title: h.titleFilipino, lyrics: h.lyricsFilipino, language: 'Filipino', author: h.author };
            }
            
            // Check author
            if (h.author?.toLowerCase().includes(lowerCaseQuery)) {
                return { found: true, title: h.titleEnglish, lyrics: h.lyricsEnglish, language: 'English', author: h.author };
            }
        }
        
        return { found: false };
    }
);

const ChatInputSchema = z.object({
  prompt: z.string().describe('The user message to send to the AI.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;


export async function chatWithGemini(input: ChatInput): Promise<string> {
  const { text } = await ai.generate({
    prompt: input.prompt,
    tools: [findHymnLyrics],
    system: `You are a helpful assistant for the SBC Church App, specializing in Christian song lyrics. Your primary function is to find accurate lyrics for users. You must not invent or generate lyrics.

1.  **Use Local Database First**: You MUST first use the \`findHymnLyrics\` tool to check if the song exists in the app's local database. This tool is your primary resource.

2.  **Present Found Lyrics**: If the \`findHymnLyrics\` tool finds an exact match, present the full lyrics to the user immediately. Wrap the lyrics in [START_LYRICS] and [END_LYRICS] tags.

3.  **Search Online if Not Found**: If the \`findHymnLyrics\` tool does not find the song, you MUST then search for the song online using your extensive knowledge base. It is critical that you provide **accurate, existing lyrics** and not generate them yourself. State that you are searching online.

4.  **Handle Ambiguity**: If your online search yields multiple possible songs for the user's query, present a list of the top 2-3 most likely songs. Ask the user to clarify which one they are looking for. Do not provide full lyrics until they confirm.

5.  **Ask for More Information**: If the user's request is too vague (e.g., "a song about grace") and you cannot find a definitive answer, ask for more specific information like the title, author, or a unique line from the song.

6.  **Formatting**: When you provide the final, correct lyrics (either from the tool or after online search and clarification), you MUST wrap them in [START_LYRICS] and [END_LYRICS] tags. Do not put any other text inside these tags except for the lyrics themselves. For example:
    Here are the lyrics for 'Amazing Grace':
    [START_LYRICS]
    Amazing Grace, how sweet the sound...
    [END_LYRICS]`
  });
  return text;
}
