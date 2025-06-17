
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

const languageIsAvailable = (lang: LanguageOption, hymn: Hymn): boolean => {
  switch (lang) {
    case 'hiligaynon':
      return !!hymn.titleHiligaynon && !!hymn.lyricsHiligaynon;
    case 'filipino':
      return !!hymn.titleFilipino && !!hymn.lyricsFilipino;
    case 'english':
      return !!hymn.titleEnglish && !!hymn.lyricsEnglish;
    default:
      return false;
  }
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
  return title || hymn.titleHiligaynon || hymn.titleEnglish || "Hymn Title Unavailable";
};

const getLyricsForLanguage = (lang: LanguageOption, hymn: Hymn): string => {
  let lyrics: string | undefined;
  switch (lang) {
    case 'hiligaynon':
      lyrics = hymn.lyricsHiligaynon;
      break;
    case 'filipino':
      lyrics = hymn.lyricsFilipino;
      break;
    case 'english':
      lyrics = hymn.lyricsEnglish;
      break;
  }
  return lyrics || hymn.lyricsHiligaynon || hymn.lyricsEnglish || "Lyrics unavailable in this language.";
};

const languageOptions: { value: LanguageOption; label: string }[] = [
    { value: 'hiligaynon', label: 'Hiligaynon' },
    { value: 'filipino', label: 'Filipino' },
    { value: 'english', label: 'English' },
  ];

export default function HymnDetail({ hymn, selectedLanguage, showLanguageSelector, onSelectLanguage }: HymnDetailProps) {
  const { addHymnView } = useActivity();

  useEffect(() => {
    // Track view based on English title if available, otherwise Hiligaynon.
    const trackingTitle = hymn.titleEnglish || hymn.titleHiligaynon;
    if (trackingTitle) {
      addHymnView(trackingTitle);
    }
  }, [addHymnView, hymn.titleEnglish, hymn.titleHiligaynon, hymn.id]); // Added hymn.id to dependencies for safety

  const currentTitle = getTitleForLanguage(selectedLanguage, hymn);
  const currentLyrics = getLyricsForLanguage(selectedLanguage, hymn);

  const hasContentInSelectedLanguage = languageIsAvailable(selectedLanguage, hymn);

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
              const isAvailable = languageIsAvailable(option.value, hymn);
              if (!isAvailable) return null; // Don't render button if language not available

              return (
                <Button
                  key={option.value}
                  variant={selectedLanguage === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSelectLanguage(option.value)}
                  disabled={!isAvailable} // Disable if not available, though it's also hidden
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
        {!hasContentInSelectedLanguage ? (
           <p className="text-muted-foreground italic text-center py-4">Lyrics not available in the selected language.</p>
        ) : (
          <div>
            <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
              {currentLyrics}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
