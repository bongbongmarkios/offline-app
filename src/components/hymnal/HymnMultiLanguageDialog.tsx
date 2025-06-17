'use client';

import type { Hymn } from '@/types';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface HymnMultiLanguageToggleProps {
  hymn: Hymn;
  onToggle: () => void; // Callback to toggle language selector visibility
}

export default function HymnMultiLanguageDialog({ hymn, onToggle }: HymnMultiLanguageToggleProps) {
  if (!hymn.pageNumber) { // Only show if page number exists
    return null;
  }
  // Optionally, you could also check if there's more than one language available before showing the toggle
  // const availableLanguages = ['hiligaynon', 'filipino', 'english'].filter(lang => {
  //   if (lang === 'hiligaynon') return !!hymn.lyricsHiligaynon;
  //   if (lang === 'filipino') return !!hymn.lyricsFilipino;
  //   if (lang === 'english') return !!hymn.lyricsEnglish;
  //   return false;
  // }).length;
  // if (availableLanguages <= 1) return null;


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
