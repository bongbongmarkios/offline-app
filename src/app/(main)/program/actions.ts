
'use server';

import { revalidatePath } from 'next/cache';
import { addSampleProgram } from '@/data/programs';
import type { Program } from '@/types';
import { programItemTitles } from '@/types';

export async function createNewProgramAction() {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const newProgramData: Omit<Program, 'id' | 'items'> = {
    title: `New Program - ${new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`,
    date: currentDate,
  };

  try {
    // Add a few default items to the new program
    const defaultItemsForNewProgram: ProgramItem['title'][] = [
      programItemTitles[2], // Opening Hymn
      programItemTitles[3], // Opening Prayer
      programItemTitles[10], // Message
      programItemTitles[12], // Closing Hymn
    ];
    
    addSampleProgram(newProgramData, defaultItemsForNewProgram);
    // console.log('New program added. Current programs count:', samplePrograms.length);
  } catch (error) {
    console.error('Failed to create new program:', error);
    return { error: 'Failed to create program.' };
  }

  revalidatePath('/program');
}
