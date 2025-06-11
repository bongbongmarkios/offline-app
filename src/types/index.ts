export interface Hymn {
  id: string;
  title: string;
  number?: string;
  lyrics: string; 
  composer?: string;
  author?: string;
  category?: string; // e.g. Worship, Thanksgiving, etc.
}

export const programItemTitles = [
  "Doxology", 
  "Call to Worship", 
  "Opening Hymn", 
  "Opening Prayer", 
  "Responsive Reading", 
  "Rice for Mission offering with children's choir", 
  "Hymn of Preparation", 
  "Scripture Reading", 
  "Pastoral Prayer", 
  "Choir", 
  "Message", 
  "Giving of tithe's or pledges and offering to the lord", 
  "Closing Hymn", 
  "Prayer of Benediction"
] as const;

export type ProgramItemTitle = typeof programItemTitles[number];

export interface ProgramItem {
  id: string; // Unique ID for the item within the program
  title: ProgramItemTitle;
  content?: string; // e.g., scripture text, prayer text, or reference to a hymn/reading ID
  hymnId?: string; // Optional: if item is a hymn, link to Hymn
  readingId?: string; // Optional: if item is a responsive reading, link to Reading
}

export interface Program {
  id: string;
  title: string;
  date?: string; 
  items: ProgramItem[];
}

export interface Reading {
  id: string;
  title: string;
  lyrics: string; 
  source?: string; 
}

// For AI suggestions
export type UserActivity = {
  recentProgramItems: string[];
  recentHymns: string[];
  recentReadings: string[];
};
