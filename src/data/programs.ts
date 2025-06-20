
import type { Program, ProgramItem } from '@/types';
import { programItemTitles } from '@/types';

let itemIdCounter = 0;

// Ensure createProgramItems is correctly defined and usable
const createProgramItems = (titles: ProgramItem['title'][]): ProgramItem[] => {
  return titles.map(title => ({
    id: `item-${itemIdCounter++}`,
    title: title,
  }));
};

export let samplePrograms: Program[] = [
  {
    id: '30001',
    title: 'Sunday Morning Worship - July 21, 2024',
    date: '2024-07-21',
    items: createProgramItems([
      programItemTitles[0], 
      programItemTitles[1], 
      programItemTitles[2], 
      programItemTitles[3], 
      programItemTitles[4], 
      programItemTitles[5], 
      programItemTitles[6], 
      programItemTitles[7], 
      programItemTitles[8], 
      programItemTitles[9], 
      programItemTitles[10], 
      programItemTitles[11], 
      programItemTitles[12], 
      programItemTitles[13], 
    ]),
  },
  {
    id: '30002',
    title: 'Evening Praise Service - July 28, 2024',
    date: '2024-07-28',
    items: createProgramItems([
      programItemTitles[2], 
      programItemTitles[3], 
      programItemTitles[7], 
      programItemTitles[10], 
      programItemTitles[6], 
      programItemTitles[12], 
      programItemTitles[13], 
    ]),
  },
];

// Function to add a new program to the in-memory sample data
export function addSampleProgram(
  programData: Omit<Program, 'id' | 'items'>,
  defaultItemTitles: ProgramItem['title'][] = []
): Program {
  let maxId = 30000; // Base for program IDs
  samplePrograms.forEach(program => {
    const idNum = parseInt(program.id, 10);
    if (!isNaN(idNum) && idNum >= 30000 && idNum < 40000) { // Check if ID is in the 30000-39999 range
      if (idNum > maxId) {
        maxId = idNum;
      }
    }
  });
  const newId = (maxId + 1).toString();

  const newProgram: Program = {
    id: newId,
    ...programData,
    items: createProgramItems(defaultItemTitles),
  };
  samplePrograms.push(newProgram);
  // Sort programs by date after adding, most recent first
  samplePrograms.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA; // Sort descending by date
  });
  return newProgram;
}

// Function to delete a program by its ID from the in-memory sample data
export function deleteSampleProgramById(programId: string): boolean {
  const initialLength = samplePrograms.length;
  samplePrograms = samplePrograms.filter(p => p.id !== programId);
  return samplePrograms.length < initialLength; // Return true if an item was deleted
}
