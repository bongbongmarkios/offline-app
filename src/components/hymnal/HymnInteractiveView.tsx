
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
import { updateSampleHymn, initialSampleHymns } from '@/data/hymns'; // Import updateSampleHymn

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
    // Load hymn from localStorage on mount if available
    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const storedHymns: Hymn[] = JSON.parse(storedHymnsString);
        const hymnFromStorage = storedHymns.find(h => h.id === initialHymn.id);
        if (hymnFromStorage) {
          setHymn(hymnFromStorage);
        } else {
          // If not in storage, use initialHymn (from server) and potentially add it to storage
          // For simplicity now, we'll just use initialHymn. A more robust solution might sync.
          setHymn(initialHymn);
        }
      } else {
        // No hymns in localStorage, use initialHymn and consider saving all initialSampleHymns
        // For now, just set the current hymn.
        setHymn(initialHymn);
        // Optionally prime localStorage with default hymns if it's empty
        // localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(initialSampleHymns));
      }
    } catch (error) {
      console.error("Error loading hymns from localStorage:", error);
      setHymn(initialHymn); // Fallback to initial prop if localStorage fails
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
    setHymn(updatedHymnData); // 1. Optimistically update local state for immediate UI feedback
    setIsEditDialogOpen(false);

    try {
      // 2. Load all hymns from localStorage
      let allStoredHymns: Hymn[] = [];
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        allStoredHymns = JSON.parse(storedHymnsString);
      }

      // 3. Find and replace the hymn in the array
      const hymnIndex = allStoredHymns.findIndex(h => h.id === updatedHymnData.id);
      if (hymnIndex > -1) {
        allStoredHymns[hymnIndex] = updatedHymnData;
      } else {
        // Should not happen for an edit, but as a fallback, add it.
        // Or, if localStorage was empty, initialize with initialSampleHymns and then update.
        // For simplicity, if not found, we'll just use the current hymn or ensure initialSampleHymns are there.
        // A more robust approach might be to ensure localStorage is always primed.
        // For now, if it wasn't there, we'll add the updated one. If it means it's a new list:
        if(allStoredHymns.length === 0 && initialSampleHymns.find(h => h.id === updatedHymnData.id)){
            // If local storage was empty, but this hymn was part of initial load,
            // it's better to re-initialize local storage with initial data and then update.
            // This is complex. For now, just add/replace.
             allStoredHymns.push(updatedHymnData); // Fallback: add if not found
        } else if (hymnIndex === -1) {
             allStoredHymns.push(updatedHymnData);
        }
      }
      // 4. Save the entire modified array back to localStorage
      localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(allStoredHymns));
    } catch (error) {
        console.error("Error saving hymn to localStorage:", error);
    }
    
    // 5. Also update the in-memory store for server-side consistency during the session
    updateSampleHymn(updatedHymnData.id, updatedHymnData); 

    // 6. Refresh server components if needed, though client state is primary for this view now
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
