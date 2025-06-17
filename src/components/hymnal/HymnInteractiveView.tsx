
'use client';

import { useState, useEffect } from 'react';
import type { Hymn } from '@/types';
import AppHeader from '@/components/layout/AppHeader';
import HymnDetail from '@/components/hymnal/HymnDetail';
import HymnMultiLanguageDialog from '@/components/hymnal/HymnMultiLanguageDialog'; // This is the Globe icon button
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FilePenLine } from 'lucide-react'; // Added FilePenLine

type LanguageOption = 'hiligaynon' | 'filipino' | 'english';

interface HymnInteractiveViewProps {
  hymn: Hymn;
}

// Helper function to check language availability
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

export default function HymnInteractiveView({ hymn }: HymnInteractiveViewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>('hiligaynon');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    // Set default language based on availability, prioritizing Hiligaynon
    if (languageIsAvailable('hiligaynon', hymn)) {
      setSelectedLanguage('hiligaynon');
    } else if (languageIsAvailable('english', hymn)) {
      setSelectedLanguage('english');
    } else if (languageIsAvailable('filipino', hymn)) {
      setSelectedLanguage('filipino');
    }
  }, [hymn]);

  const toggleLanguageSelector = () => {
    setShowLanguageSelector(prev => !prev);
  };

  const handleSelectLanguage = (language: LanguageOption) => {
    setSelectedLanguage(language);
    // Optionally close selector after choice, but current design keeps it open
    // setShowLanguageSelector(false); 
  };

  const headerActions = (
    <>
      {/* Edit Button - Placeholder functionality */}
      <Button variant="ghost" size="icon" aria-label="Edit hymn">
        <FilePenLine className="h-6 w-6 text-muted-foreground" />
      </Button>
      <HymnMultiLanguageDialog hymn={hymn} onToggle={toggleLanguageSelector} />
    </>
  );

  return (
    <>
      <AppHeader
        title={
          <Button asChild variant="outline" size="sm">
            <Link href="/hymnal">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hymnal
            </Link>
          </Button>
        }
        actions={hymn.pageNumber ? headerActions : null} // Show actions only if pageNumber exists
        hideDefaultActions={true}
      />
      <div className="container mx-auto px-4 pb-8">
        <HymnDetail
          hymn={hymn}
          selectedLanguage={selectedLanguage}
          showLanguageSelector={showLanguageSelector}
          onSelectLanguage={handleSelectLanguage}
        />
      </div>
    </>
  );
}
