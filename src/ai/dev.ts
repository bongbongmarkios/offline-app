
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-related-content.ts';
import '@/ai/flows/chat-flow.ts'; // Added import for the new chat flow
