
import type { Hymn } from '@/types';

// initialSampleHymns now contains only one hymn.
export let initialSampleHymns: Hymn[] = [
  {
    id: '1',
    titleEnglish: 'New Sample Hymn Title (English)',
    lyricsEnglish: `This is the first verse of the new sample English lyrics.
This is the second verse of the new sample English lyrics.

This is the chorus.
Glory to the new hymn!

This is the third verse, full of praise.
And a final line to conclude.`,
    titleHiligaynon: 'BAG-O NGA HALIMBAWA NGA AMBAHANON (Hiligaynon)',
    lyricsHiligaynon: `Amo ini ang nahauna nga berso sang bag-o nga halimbawa nga Hiligaynon nga liriko.
Amo ini ang ikaduha nga berso sang bag-o nga halimbawa nga Hiligaynon nga liriko.

Amo ini ang koro.
Himaya sa bag-o nga ambahanon!

Amo ini ang ikatlo nga berso, puno sang pagdayaw.
Kag isa ka katapusan nga linya sa pagtapos.`,
    titleFilipino: 'BAGONG HALIMBAWANG AWIT (Filipino)',
    lyricsFilipino: `Ito ang unang taludtod ng bagong halimbawang liriko sa Filipino.
Ito ang ikalawang taludtod ng bagong halimbawang liriko sa Filipino.

Ito ang koro.
Luwalhati sa bagong awit!

Ito ang ikatlong taludtod, puno ng papuri.
At isang huling linya upang magtapos.`,
    author: 'App Prototyper',
    category: 'General',
    pageNumber: '1',
    keySignature: 'C Major',
    externalUrl: undefined,
  }
];

// Function to update an existing hymn in the in-memory sample data
export function updateSampleHymn(hymnId: string, updatedData: Partial<Omit<Hymn, 'id'>>): Hymn | null {
  const hymnIndex = initialSampleHymns.findIndex(h => h.id === hymnId);
  if (hymnIndex === -1) {
    // If hymn not found, and we are aiming for a single-hymn scenario after this reset,
    // it might be an error to try to update something that doesn't exist.
    // However, to keep functionality, if the ID matches the new single hymn, update it.
    if (initialSampleHymns.length === 1 && initialSampleHymns[0].id === hymnId) {
      initialSampleHymns[0] = { ...initialSampleHymns[0], ...updatedData };
      return initialSampleHymns[0];
    }
    return null;
  }
  initialSampleHymns[hymnIndex] = {
    ...initialSampleHymns[hymnIndex],
    ...updatedData,
  };
  return initialSampleHymns[hymnIndex];
}

// Function to delete hymns by their IDs from the in-memory sample data
export function deleteSampleHymnsByIds(hymnIds: string[]): void {
  initialSampleHymns = initialSampleHymns.filter(hymn => !hymnIds.includes(hymn.id));
}

// Function to add a new hymn to the in-memory sample data
// Kept for potential programmatic use or future re-integration.
export function addSampleHymn(hymnData: Omit<Hymn, 'id'>): Hymn {
  // If the goal is to re-add to a list that might have been cleared,
  // this ID generation needs to be robust.
  // For now, if initialSampleHymns is empty, it will start from '1'.
  // If it's not empty, it tries to find the max existing ID.
  let newIdNumber = 1;
  if (initialSampleHymns.length > 0) {
    newIdNumber = Math.max(0, ...initialSampleHymns.map(h => parseInt(h.id, 10) || 0)) + 1;
  } else {
    // If the list was completely cleared and this is the first add,
    // check if the incoming hymnData implies an ID (e.g. if pageNumber should be ID)
    // For simplicity, we use a numeric sequence.
  }

  const newId = newIdNumber.toString();
  
  const newHymn: Hymn = {
    id: newId,
    ...hymnData,
  };
  initialSampleHymns.push(newHymn);
  return newHymn;
}

