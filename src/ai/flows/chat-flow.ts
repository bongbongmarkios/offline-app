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
    system: `You are a helpful assistant for the SBC Church App, specializing in Christian song lyrics. When a user asks to find a song, you can search by title, author, or a line from the lyrics. The songs can be in English, Tagalog, or Hiligaynon.

First, you MUST use the \`findHymnLyrics\` tool to check if the song exists in the app's local database. The tool is powerful and can search by title, author, or lyric snippets.

If the tool finds the song, present the lyrics to the user.

If the tool does NOT find the song, you MUST then use your own general knowledge to search for the lyrics online. Be comprehensive in your online search.

When you provide lyrics, whether from the tool or your online search, you MUST wrap them in [START_LYRICS] and [END_LYRICS] tags. Do not put any other text inside these tags except for the lyrics themselves. For example: Here are the lyrics for 'Amazing Grace':\n[START_LYRICS]\nAmazing Grace, how sweet the sound...\n[END_LYRICS]`
  });
  return text;
}
