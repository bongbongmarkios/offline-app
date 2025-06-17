
'use client';
import type { Hymn } from '@/types';
import { useEffect } from 'react';
import { useActivity } from '@/hooks/useActivityTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

type LanguageOption = 'hiligaynon' | 'filipino' | 'english';

interface HymnDetailProps {
  hymn: Hymn;
  selectedLanguage: LanguageOption;
  showLanguageSelector: boolean;
  onSelectLanguage: (language: LanguageOption) => void;
}

// Refined: Determines if a language option should be shown.
// For English/Hiligaynon (required lyrics field), available if title exists.
// For Filipino (optional lyrics field), available if title AND lyrics exist and are non-empty.
const languageIsActuallyAvailableForSelection = (lang: LanguageOption, hymn: Hymn): boolean => {
  switch (lang) {
    case 'hiligaynon': // Hiligaynon title is required by type for a valid hymn. Lyrics also required.
      return !!hymn.titleHiligaynon;
    case 'filipino':   // Filipino title and lyrics are optional.
      return !!hymn.titleFilipino && !!hymn.lyricsFilipino; // Must have non-empty lyrics for Filipino to be an option.
    case 'english':    // English title is required by type for a valid hymn. Lyrics (string) can be empty.
      return !!hymn.titleEnglish;
    default:
      return false;
  }
};

// Refined: Gets lyrics for the selected language.
// Returns "" for English/Hiligaynon if their lyrics are explicitly empty.
// Falls back only if lyrics for the selected language are truly undefined (e.g., optional Filipino).
const getLyricsForLanguage = (lang: LanguageOption, hymn: Hymn): string => {
  let lyrics: string | undefined;

  switch (lang) {
    case 'hiligaynon':
      lyrics = hymn.lyricsHiligaynon; // Required, can be ""
      break;
    case 'filipino':
      lyrics = hymn.lyricsFilipino;   // Optional, can be undefined
      break;
    case 'english':
      lyrics = hymn.lyricsEnglish;    // Required, can be ""
      break;
    default:
      // Should not happen with LanguageOption type
      lyrics = undefined;
  }

  // If lyrics for the selected language are defined (this includes empty strings for English/Hiligaynon),
  // and the title for that language exists (implied for Hiligaynon/English by type, checked for Filipino via languageIsActuallyAvailableForSelection),
  // then use those lyrics.
  if (lyrics !== undefined && 
      ((lang === 'filipino' && hymn.titleFilipino) || (lang !== 'filipino'))) {
    return lyrics;
  }

  // Fallback logic: If selected language lyrics were undefined (e.g. Filipino not provided)
  // Prefer Hiligaynon as primary fallback if available
  if (hymn.lyricsHiligaynon !== undefined) { // Should always be true due to type
    return hymn.lyricsHiligaynon;
  }
  // Then English if Hiligaynon somehow wasn't available (shouldn't happen)
  if (hymn.lyricsEnglish !== undefined) { // Should always be true due to type
    return hymn.lyricsEnglish;
  }
  
  return "Lyrics unavailable in this language.";
};


const getTitleForLanguage = (lang: LanguageOption, hymn: Hymn): string => {
  let title: string | undefined;
  switch (lang) {
    case 'hiligaynon':
      title = hymn.titleHiligaynon;
      break;
    case 'filipino':
      title = hymn.titleFilipino;
      break;
    case 'english':
      title = hymn.titleEnglish;
      break;
  }
  // Fallback title display
  return title || hymn.titleHiligaynon || hymn.titleEnglish || "Hymn Title Unavailable";
};

const languageOptions: { value: LanguageOption; label: string }[] = [
    { value: 'hiligaynon', label: 'Hiligaynon' },
    { value: 'filipino', label: 'Filipino' },
    { value: 'english', label: 'English' },
  ];

export default function HymnDetail({ hymn, selectedLanguage, showLanguageSelector, onSelectLanguage }: HymnDetailProps) {
  const { addHymnView } = useActivity();

  useEffect(() => {
    const trackingTitle = hymn.titleEnglish || hymn.titleHiligaynon;
    if (trackingTitle) {
      addHymnView(trackingTitle);
    }
  }, [addHymnView, hymn.titleEnglish, hymn.titleHiligaynon, hymn.id]);

  const currentTitle = getTitleForLanguage(selectedLanguage, hymn);
  const currentLyrics = getLyricsForLanguage(selectedLanguage, hymn);

  // Determine if content (lyrics) is truly available for the selected language,
  // or if we are showing fallback lyrics.
  // This is true if currentLyrics is not the generic "unavailable" message.
  // And, for the selected language, its specific lyrics field was not undefined.
  let hasSpecificContentForSelectedLanguage: boolean;
  if (selectedLanguage === 'filipino') {
    hasSpecificContentForSelectedLanguage = hymn.lyricsFilipino !== undefined && !!hymn.titleFilipino;
  } else if (selectedLanguage === 'english') {
    // English lyrics are a string, can be empty. Considered specific content if title exists.
    hasSpecificContentForSelectedLanguage = !!hymn.titleEnglish; 
  } else { // Hiligaynon
    // Hiligaynon lyrics are a string, can be empty. Considered specific content if title exists.
    hasSpecificContentForSelectedLanguage = !!hymn.titleHiligaynon;
  }
  
  const displayLyrics = currentLyrics; // Lyrics to actually display (could be specific or fallback)
  const showNoLyricsMessage = !hasSpecificContentForSelectedLanguage && displayLyrics === "Lyrics unavailable in this language.";


  return (
    <Card className="shadow-lg">
      <CardHeader className="relative">
        <div className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">
            {currentTitle.toUpperCase()}
          </CardTitle>
          {selectedLanguage !== 'hiligaynon' && hymn.titleHiligaynon && hymn.titleHiligaynon.toUpperCase() !== currentTitle.toUpperCase() && (
             <p className="text-md text-muted-foreground">{hymn.titleHiligaynon.toUpperCase()}</p>
          )}
          {selectedLanguage !== 'filipino' && hymn.titleFilipino && hymn.titleFilipino.toUpperCase() !== currentTitle.toUpperCase() && (
            <p className="text-md text-muted-foreground">{hymn.titleFilipino.toUpperCase()}</p>
          )}
          {selectedLanguage !== 'english' && hymn.titleEnglish && hymn.titleEnglish.toUpperCase() !== currentTitle.toUpperCase() && (
            <p className="text-md text-muted-foreground">{hymn.titleEnglish}</p>
          )}
        </div>

        <div className="mt-3 text-md text-muted-foreground space-y-1 text-center">
            {hymn.keySignature && <p>Key: {hymn.keySignature}</p>}
            {hymn.pageNumber && <p>Page: {hymn.pageNumber}</p>}
        </div>

        {showLanguageSelector && (
          <div className="flex items-center justify-center gap-2 py-3 border-y my-3">
            {languageOptions.map((option) => {
              // Use refined availability check for rendering buttons
              const isSelectable = languageIsActuallyAvailableForSelection(option.value, hymn);
              if (!isSelectable) return null; 

              return (
                <Button
                  key={option.value}
                  variant={selectedLanguage === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSelectLanguage(option.value)}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        )}
      </CardHeader>
      <Separator className="my-2"/>
      <CardContent className="pt-4 space-y-6">
        {showNoLyricsMessage ? (
           <p className="text-muted-foreground italic text-center py-4">Lyrics not available in the selected language.</p>
        ) : (
          <div>
            <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
              {displayLyrics} {/* This will show "" if lyrics are intentionally blank and selected */}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
