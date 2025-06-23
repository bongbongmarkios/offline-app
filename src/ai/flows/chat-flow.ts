'use server';
/**
 * @fileOverview A Genkit flow for basic chat with Gemini, with a tool for finding lyrics.
 *
 * - chatWithGemini - A function that takes a user prompt and returns Gemini's response.
 * - ChatInput - The type for the input.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { initialSampleHymns } from '@/data/hymns';

// Tool to find hymn lyrics
const findHymnLyrics = ai.defineTool(
    {
        name: 'findHymnLyrics',
        description: 'Finds the lyrics for a given hymn title. Searches English, Hiligaynon, and Filipino titles.',
        inputSchema: z.object({
            title: z.string().describe('The title of the hymn to search for.'),
        }),
        outputSchema: z.object({
            found: z.boolean(),
            title: z.string().optional(),
            lyrics: z.string().optional(),
            language: z.string().optional(),
        }),
    },
    async ({ title }) => {
        const lowerCaseTitle = title.toLowerCase();
        
        // Search all hymns for a match in any language title
        const foundHymn = initialSampleHymns.find(h => 
            h.titleEnglish.toLowerCase().includes(lowerCaseTitle) ||
            h.titleHiligaynon.toLowerCase().includes(lowerCaseTitle) ||
            (h.titleFilipino && h.titleFilipino.toLowerCase().includes(lowerCaseTitle))
        );

        if (foundHymn) {
            // Determine which language was likely matched to return the correct lyrics
            if (foundHymn.titleEnglish.toLowerCase().includes(lowerCaseTitle)) {
                return { found: true, title: foundHymn.titleEnglish, lyrics: foundHymn.lyricsEnglish, language: 'English' };
            } else if (foundHymn.titleHiligaynon.toLowerCase().includes(lowerCaseTitle)) {
                  return { found: true, title: foundHymn.titleHiligaynon, lyrics: foundHymn.lyricsHiligaynon, language: 'Hiligaynon' };
            } else if (foundHymn.titleFilipino && foundHymn.titleFilipino.toLowerCase().includes(lowerCaseTitle)) {
                  return { found: true, title: foundHymn.titleFilipino, lyrics: foundHymn.lyricsFilipino, language: 'Filipino' };
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
    system: `You are a helpful assistant for the SBC Church App. If a user asks for the lyrics of a song, you must use the findHymnLyrics tool to find them. If the tool finds the lyrics, present them to the user. When you provide the lyrics, you MUST wrap them in [START_LYRICS] and [END_LYRICS] tags. Do not put any other text inside these tags except for the lyrics themselves. For example: Here are the lyrics for 'Amazing Grace':\n[START_LYRICS]\nAmazing Grace, how sweet the sound...\n[END_LYRICS]`
  });
  return text;
}
