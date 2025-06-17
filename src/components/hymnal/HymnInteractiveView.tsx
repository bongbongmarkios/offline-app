
'use client';

import { useState, useEffect } from 'react';
import type { Hymn } from '@/types';
import AppHeader from '@/components/layout/AppHeader';
import HymnDetail from '@/components/hymnal/HymnDetail';
import HymnMultiLanguageDialog from '@/components/hymnal/HymnMultiLanguageDialog';
import EditHymnForm from '@/components/hymnal/EditHymnForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Link from 'next/link';
import { ArrowLeft, FilePenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';

type LanguageOption = 'hiligaynon' | 'filipino' | 'english';

interface HymnInteractiveViewProps {
  initialHymn: Hymn; // Renamed prop
}

export default function HymnInteractiveView({ initialHymn }: HymnInteractiveViewProps) {
  const [hymn, setHymn] = useState<Hymn>(initialHymn); // Local state for hymn
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>('hiligaynon');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  // Update local hymn state if initialHymn prop changes (e.g., after router.refresh completes)
  useEffect(() => {
    setHymn(initialHymn);
  }, [initialHymn]);

  // Effect to set default language based on availability and when the hymn object changes
  useEffect(() => {
    if (languageIsAvailable('hiligaynon', hymn)) {
      setSelectedLanguage('hiligaynon');
    } else if (languageIsAvailable('english', hymn)) {
      setSelectedLanguage('english');
    } else if (languageIsAvailable('filipino', hymn)) {
      setSelectedLanguage('filipino');
    } else {
      setSelectedLanguage('hiligaynon'); // Fallback if somehow no languages are available
    }
    // Reset language selector visibility when hymn changes (e.g. after edit)
    setShowLanguageSelector(false);
  }, [hymn]);


  const toggleLanguageSelector = () => {
    setShowLanguageSelector(prev => !prev);
  };

  const handleSelectLanguage = (language: LanguageOption) => {
    setSelectedLanguage(language);
  };

  const handleEditSuccess = (updatedHymnData: Hymn) => {
    setHymn(updatedHymnData); // Optimistically update local state
    setIsEditDialogOpen(false);
    router.refresh(); // Refresh the page to ensure server state is primary and other parts of app get updates
  };

  // Helper function to check language availability
  const languageIsAvailable = (lang: LanguageOption, currentHymn: Hymn): boolean => {
    if (!currentHymn) return false;
    switch (lang) {
      case 'hiligaynon':
        return !!currentHymn.titleHiligaynon && !!currentHymn.lyricsHiligaynon;
      case 'filipino':
        return !!currentHymn.titleFilipino && !!currentHymn.lyricsFilipino;
      case 'english':
        return !!currentHymn.titleEnglish && !!currentHymn.lyricsEnglish;
      default:
        return false;
    }
  };

  const headerActions = (
    <>
      <Button variant="ghost" size="icon" aria-label="Edit hymn" onClick={() => setIsEditDialogOpen(true)}>
        <FilePenLine className="h-6 w-6 text-muted-foreground" />
      </Button>
      <HymnMultiLanguageDialog hymn={hymn} onToggle={toggleLanguageSelector} />
    </>
  );

  if (!hymn) { // Should not happen if page.tsx handles notFound, but good for robustness
    return <div>Loading hymn...</div>;
  }

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
        actions={hymn.pageNumber ? headerActions : null}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[85vh] flex flex-col sm:rounded-[25px]">
          <DialogHeader>
            <DialogTitle>Edit Hymn: {hymn.titleEnglish || hymn.titleHiligaynon}</DialogTitle>
            <DialogDescription>
              Modify the details of the hymn below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <EditHymnForm
            hymnToEdit={hymn}
            onEditSuccess={handleEditSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
            className="pt-0 flex-1 min-h-0"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
