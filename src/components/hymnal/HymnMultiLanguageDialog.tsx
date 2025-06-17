
'use client';

import { useState, type ReactNode } from 'react';
import type { Hymn } from '@/types';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HymnMultiLanguageDialogProps {
  hymn: Hymn;
  pageNumberExists: boolean;
}

type LanguageOption = 'hiligaynon' | 'filipino' | 'english';

export default function HymnMultiLanguageDialog({ hymn, pageNumberExists }: HymnMultiLanguageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDialogLanguage, setSelectedDialogLanguage] = useState<LanguageOption>('hiligaynon');

  if (!pageNumberExists) {
    return null; 
  }

  const languageIsAvailable = (lang: LanguageOption): boolean => {
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

  const getTitleForLanguage = (lang: LanguageOption): string | undefined => {
    switch (lang) {
      case 'hiligaynon':
        return hymn.titleHiligaynon;
      case 'filipino':
        return hymn.titleFilipino;
      case 'english':
        return hymn.titleEnglish;
      default:
        // Fallback to Hiligaynon or English if primary selected is not available
        return hymn.titleHiligaynon || hymn.titleEnglish;
    }
  };

  const getLyricsForLanguage = (lang: LanguageOption): string | undefined => {
    switch (lang) {
      case 'hiligaynon':
        return hymn.lyricsHiligaynon;
      case 'filipino':
        return hymn.lyricsFilipino;
      case 'english':
        return hymn.lyricsEnglish;
      default:
         // Fallback to Hiligaynon or English if primary selected is not available
        return hymn.lyricsHiligaynon || hymn.lyricsEnglish;
    }
  };

  const languageOptions: { value: LanguageOption; label: string }[] = [
    { value: 'hiligaynon', label: 'Hiligaynon' },
    { value: 'filipino', label: 'Filipino' },
    { value: 'english', label: 'English' },
  ];

  // Ensure a sensible default if Hiligaynon is not available for some reason
  useEffect(() => {
    if (!languageIsAvailable('hiligaynon')) {
        if (languageIsAvailable('english')) {
            setSelectedDialogLanguage('english');
        } else if (languageIsAvailable('filipino')) {
            setSelectedDialogLanguage('filipino');
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hymn]); // Re-check if hymn changes

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="View hymn in other languages">
          <Globe className="h-8 w-8 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>View Hymn: {getTitleForLanguage(selectedDialogLanguage) || hymn.titleEnglish || hymn.titleHiligaynon}</DialogTitle>
          <DialogDescription>
            Select a language to view the hymn.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 py-3 border-y mb-3">
          {languageOptions.map((option) => {
            const isAvailable = languageIsAvailable(option.value);
            return (
              <Button
                key={option.value}
                variant={selectedDialogLanguage === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDialogLanguage(option.value)}
                disabled={!isAvailable}
                className={!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {option.label}
              </Button>
            );
          })}
        </div>

        <ScrollArea className="flex-grow pr-2">
          <div className="space-y-4 pb-4">
            <h3 className="font-headline text-2xl text-primary mb-1">
              {getTitleForLanguage(selectedDialogLanguage)}
            </h3>
            <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
              {getLyricsForLanguage(selectedDialogLanguage) || <p className="text-muted-foreground italic">Lyrics not available in this language.</p>}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

