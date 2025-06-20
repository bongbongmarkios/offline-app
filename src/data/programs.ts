
import type { Program, ProgramItem } from '@/types';
import { programItemTitles } from '@/types';

let itemIdCounter = 0;

// This function is kept for seeding initial samplePrograms
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
  itemsToCreate: Omit<ProgramItem, 'id'>[] // New parameter signature for detailed items
): Program {
  let maxId = 30000; // Base for program IDs
  samplePrograms.forEach(program => {
    const idNum = parseInt(program.id, 10);
    if (!isNaN(idNum) && idNum >= 30000 && idNum < 40000) {
      if (idNum > maxId) {
        maxId = idNum;
      }
    }
  });
  const newId = (maxId + 1).toString();

  const newProgram: Program = {
    id: newId,
    ...programData,
    items: itemsToCreate.map(item => ({
      id: `item-${itemIdCounter++}`,
      ...item,
    })),
  };
  samplePrograms.push(newProgram);
  samplePrograms.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
  return newProgram;
}

// Function to "delete" a program by its ID from the in-memory sample data
// It now returns the deleted program object, or null if not found.
export function deleteSampleProgramById(programId: string): Program | null {
  const programIndex = samplePrograms.findIndex(p => p.id === programId);
  if (programIndex > -1) {
    const deletedProgram = samplePrograms.splice(programIndex, 1)[0];
    return deletedProgram;
  }
  return null; // Program not found
}
