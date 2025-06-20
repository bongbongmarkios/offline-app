
'use server';

import { revalidatePath } from 'next/cache';
import { addSampleProgram, deleteSampleProgramById, samplePrograms } from '@/data/programs';
import type { Program, ProgramItem, ProgramItemTitle } from '@/types'; // Added ProgramItemTitle
// import { programItemTitles } from '@/types'; // No longer needed here directly

export interface CreateProgramArgs {
  title: string;
  date: string; // Expected in YYYY-MM-DD format
  itemTitles: ProgramItemTitle[]; // Array of selected item titles
}

export async function createNewProgramAction(args: CreateProgramArgs) {
  const newProgramData: Omit<Program, 'id' | 'items'> = {
    title: args.title,
    date: args.date,
  };

  let addedProgram: Program | null = null;
  try {
    // Use the itemTitles passed from the form, or an empty array if none (though form should validate for at least one)
    const itemsToCreate = args.itemTitles.length > 0 ? args.itemTitles : [];
    
    addedProgram = addSampleProgram(newProgramData, itemsToCreate);

  } catch (error) {
    console.error('Failed to create new program:', error);
    return { error: 'Failed to create program.' };
  }

  revalidatePath('/program');
  return { success: true, newProgram: addedProgram };
}

export async function deleteProgramAction(programId: string) {
  try {
    const deletedProgram = deleteSampleProgramById(programId);
    if (deletedProgram) {
      revalidatePath('/program');
      return { success: true, deletedProgram };
    }
    return { error: 'Program not found or already deleted.'}
  } catch (error) {
    console.error('Failed to delete program:', error);
    return { error: 'Failed to delete program.' };
  }
}
