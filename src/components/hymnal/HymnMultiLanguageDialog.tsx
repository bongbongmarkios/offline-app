
'use client';

import type { Hymn } from '@/types';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

// Define LanguageOption type
type LanguageOption = 'hiligaynon' | 'filipino' | 'english';

interface HymnMultiLanguageToggleProps {
  hymn: Hymn;
  onToggle: () => void; // Callback to toggle language selector visibility
}

// Helper function to check if multiple languages are available
const hasMultipleAvailableLanguages = (hymn: Hymn): boolean => {
  let availableCount = 0;
  if (hymn.lyricsHiligaynon) availableCount++;
  if (hymn.lyricsFilipino) availableCount++;
  if (hymn.lyricsEnglish) availableCount++;
  return availableCount > 1;
};

export default function HymnMultiLanguageDialog({ hymn, onToggle }: HymnMultiLanguageToggleProps) {
  // Show toggle button only if page number exists and there's content in more than one language
  // or if we want to allow selection even if only one is present (e.g. to switch from a missing default)
  // For now, let's stick to pageNumber check, and the parent page can decide if the selector itself makes sense.
  // The HymnDetail will handle disabling buttons for unavailable languages.
  if (!hymn.pageNumber) {
    return null; 
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Toggle language selection"
      onClick={onToggle}
    >
      <Globe className="h-8 w-8 text-muted-foreground" />
    </Button>
  );
}
