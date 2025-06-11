import type { Program, ProgramItem } from '@/types';
import { programItemTitles } from '@/types';

let itemIdCounter = 0;

const createProgramItems = (titles: ProgramItem['title'][]): ProgramItem[] => {
  return titles.map(title => ({
    id: `item-${itemIdCounter++}`,
    title: title,
    // You could add specific content, hymnId, or readingId here if needed
    // For example, for 'Opening Hymn', you might add: hymnId: sampleHymns[0].id
  }));
};

export const samplePrograms: Program[] = [
  {
    id: 'p1',
    title: 'Sunday Morning Worship - July 21, 2024',
    date: '2024-07-21',
    items: createProgramItems([
      programItemTitles[0], // Doxology
      programItemTitles[1], // Call to Worship
      programItemTitles[2], // Opening Hymn
      programItemTitles[3], // Opening Prayer
      programItemTitles[4], // Responsive Reading
      programItemTitles[5], // Rice for Mission...
      programItemTitles[6], // Hymn of Preparation
      programItemTitles[7], // Scripture Reading
      programItemTitles[8], // Pastoral Prayer
      programItemTitles[9], // Choir
      programItemTitles[10], // Message
      programItemTitles[11], // Giving of tithes...
      programItemTitles[12], // Closing Hymn
      programItemTitles[13], // Prayer of Benediction
    ]),
  },
  {
    id: 'p2',
    title: 'Evening Praise Service - July 28, 2024',
    date: '2024-07-28',
    items: createProgramItems([
      programItemTitles[2], // Opening Hymn
      programItemTitles[3], // Opening Prayer
      programItemTitles[7], // Scripture Reading
      programItemTitles[10], // Message
      programItemTitles[6], // Hymn of Preparation
      programItemTitles[12], // Closing Hymn
      programItemTitles[13], // Prayer of Benediction
    ]),
  },
];
