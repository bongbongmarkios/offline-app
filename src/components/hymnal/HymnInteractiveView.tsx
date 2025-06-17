
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
import { ArrowLeft, FilePenLine, Music } from 'lucide-react'; // Changed StickyNote to Music
import { useRouter } from 'next/navigation';
import { updateSampleHymn, initialSampleHymns } from '@/data/hymns'; 

type LanguageOption = 'hiligaynon' | 'filipino' | 'english';
const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

interface HymnInteractiveViewProps {
  initialHymn: Hymn; 
}

export default function HymnInteractiveView({ initialHymn }: HymnInteractiveViewProps) {
  const [hymn, setHymn] = useState<Hymn>(initialHymn); 
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>('hiligaynon');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const storedHymns: Hymn[] = JSON.parse(storedHymnsString);
        const hymnFromStorage = storedHymns.find(h => h.id === initialHymn.id);
        if (hymnFromStorage) {
          setHymn(hymnFromStorage);
        } else {
          setHymn(initialHymn);
        }
      } else {
        setHymn(initialHymn);
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(initialSampleHymns));
      }
    } catch (error) {
      console.error("Error loading hymns from localStorage:", error);
      setHymn(initialHymn); 
    }
  }, [initialHymn.id, initialHymn]);


  useEffect(() => {
    if (languageIsAvailable('hiligaynon', hymn)) {
      setSelectedLanguage('hiligaynon');
    } else if (languageIsAvailable('english', hymn)) {
      setSelectedLanguage('english');
    } else if (languageIsAvailable('filipino', hymn)) {
      setSelectedLanguage('filipino');
    } else {
      setSelectedLanguage('hiligaynon'); 
    }
    setShowLanguageSelector(false);
  }, [hymn]);


  const toggleLanguageSelector = () => {
    setShowLanguageSelector(prev => !prev);
  };

  const handleSelectLanguage = (language: LanguageOption) => {
    setSelectedLanguage(language);
  };

  const handleEditSuccess = (updatedHymnData: Hymn) => {
    setHymn(updatedHymnData); 
    setIsEditDialogOpen(false);

    try {
      let allStoredHymns: Hymn[] = [];
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        allStoredHymns = JSON.parse(storedHymnsString);
      } else {
        allStoredHymns = [...initialSampleHymns]; 
      }

      const hymnIndex = allStoredHymns.findIndex(h => h.id === updatedHymnData.id);
      if (hymnIndex > -1) {
        allStoredHymns[hymnIndex] = updatedHymnData;
      } else {
         allStoredHymns.push(updatedHymnData); 
      }
      localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(allStoredHymns));
      
      updateSampleHymn(updatedHymnData.id, updatedHymnData); 

    } catch (error) {
        console.error("Error saving hymn to localStorage:", error);
    }
    
    router.refresh(); 
  };

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
      <Button variant="ghost" size="icon" aria-label="Add note to hymn">
        <Music className="h-6 w-6 text-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Edit hymn" onClick={() => setIsEditDialogOpen(true)}>
        <FilePenLine className="h-6 w-6 text-muted-foreground" />
      </Button>
      <HymnMultiLanguageDialog hymn={hymn} onToggle={toggleLanguageSelector} />
    </>
  );

  if (!hymn) { 
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
