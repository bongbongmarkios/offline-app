
'use server';

import { revalidatePath } from 'next/cache';
import { addSampleProgram, deleteSampleProgramById, samplePrograms } from '@/data/programs';
import type { Program, ProgramItem } from '@/types';
import { programItemTitles } from '@/types';

export interface CreateProgramArgs {
  title: string;
  date: string; // Expected in YYYY-MM-DD format
}

export async function createNewProgramAction(args: CreateProgramArgs) {
  const newProgramData: Omit<Program, 'id' | 'items'> = {
    title: args.title,
    date: args.date,
  };

  let addedProgram: Program | null = null;
  try {
    const defaultItemsForNewProgram: ProgramItem['title'][] = [
      programItemTitles[2], // Opening Hymn
      programItemTitles[3], // Opening Prayer
      programItemTitles[10], // Message
      programItemTitles[12], // Closing Hymn
    ];
    
    addedProgram = addSampleProgram(newProgramData, defaultItemsForNewProgram);

    // Update localStorage on the server if possible (this is tricky and usually client-side)
    // For consistency with client-side loading, we'll primarily rely on client updating localStorage.
    // The revalidatePath will help refresh client components that fetch.

  } catch (error) {
    console.error('Failed to create new program:', error);
    return { error: 'Failed to create program.' };
  }

  revalidatePath('/program');
  return { success: true, newProgram: addedProgram }; // Return the new program
}

export async function deleteProgramAction(programId: string) {
  try {
    const deletedProgram = deleteSampleProgramById(programId); // Now returns the deleted program or null
    if (deletedProgram) {
      revalidatePath('/program');
      return { success: true, deletedProgram }; // Return the deleted program data
    }
    return { error: 'Program not found or already deleted.'}
  } catch (error) {
    console.error('Failed to delete program:', error);
    return { error: 'Failed to delete program.' };
  }
}
