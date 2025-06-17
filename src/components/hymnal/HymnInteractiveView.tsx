
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
import { ArrowLeft, FilePenLine, Music } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateSampleHymn, initialSampleHymns } from '@/data/hymns'; 

type LanguageOption = 'hiligaynon' | 'filipino' | 'english';
const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

type SignalStrength = 'strong' | 'average' | 'weak' | 'none';

interface HymnInteractiveViewProps {
  initialHymn: Hymn; 
}

export default function HymnInteractiveView({ initialHymn }: HymnInteractiveViewProps) {
  const [hymn, setHymn] = useState<Hymn>(initialHymn); 
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>('hiligaynon');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  const [signalStrength, setSignalStrength] = useState<SignalStrength>('strong');

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
        // Initialize localStorage if it's empty
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(initialSampleHymns));
      }
    } catch (error) {
      console.error("Error loading hymns from localStorage:", error);
      setHymn(initialHymn); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHymn.id]); // Rerun if initialHymn.id changes, initialHymn itself is stable


  useEffect(() => {
    // Set initial language based on availability
    if (languageIsAvailable('hiligaynon', hymn)) {
      setSelectedLanguage('hiligaynon');
    } else if (languageIsAvailable('english', hymn)) {
      setSelectedLanguage('english');
    } else if (languageIsAvailable('filipino', hymn)) {
      setSelectedLanguage('filipino');
    } else {
      setSelectedLanguage('hiligaynon'); // Fallback if somehow no language is set
    }
    setShowLanguageSelector(false); // Ensure selector is hidden initially
  }, [hymn]); // Re-evaluate when hymn data changes (e.g., after edit)

  // Signal strength simulation for the Music icon
  useEffect(() => {
    const signalLevels: SignalStrength[] = ['strong', 'average', 'weak', 'none'];
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % signalLevels.length;
      setSignalStrength(signalLevels[currentIndex]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const getMusicIconColor = (): string => {
    switch (signalStrength) {
      case 'strong':
        return 'text-green-500';
      case 'average':
        return 'text-orange-500';
      case 'weak':
        return 'text-red-500';
      case 'none':
      default:
        return 'text-muted-foreground';
    }
  };
  
  const getMusicIconAriaLabel = (): string => {
    let label = 'Add note to hymn';
    switch (signalStrength) {
      case 'strong':
        label += ' (Signal: Strong)';
        break;
      case 'average':
        label += ' (Signal: Average)';
        break;
      case 'weak':
        label += ' (Signal: Weak)';
        break;
      case 'none':
      default:
        label += ' (Signal: None)';
        break;
    }
    return label;
  }


  const toggleLanguageSelector = () => {
    setShowLanguageSelector(prev => !prev);
  };

  const handleSelectLanguage = (language: LanguageOption) => {
    setSelectedLanguage(language);
    // setShowLanguageSelector(false); // Optionally hide selector after selection
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
        // Fallback to initialSampleHymns if localStorage is empty
        allStoredHymns = [...initialSampleHymns]; 
      }

      const hymnIndex = allStoredHymns.findIndex(h => h.id === updatedHymnData.id);
      if (hymnIndex > -1) {
        allStoredHymns[hymnIndex] = updatedHymnData;
      } else {
         // If hymn not found (e.g., new hymn scenario, though not handled here yet), add it
         allStoredHymns.push(updatedHymnData); 
      }
      localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(allStoredHymns));
      
      // Also update the in-memory initialSampleHymns.
      // This is crucial if router.refresh() causes a re-fetch from server-side data source.
      updateSampleHymn(updatedHymnData.id, updatedHymnData); 

    } catch (error) {
        console.error("Error saving hymn to localStorage:", error);
    }
    
    router.refresh(); 
  };

  // Helper function to check if content exists for a language
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
      <Button variant="ghost" size="icon" aria-label={getMusicIconAriaLabel()}>
        <Music className={`h-6 w-6 ${getMusicIconColor()}`} />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Edit hymn" onClick={() => setIsEditDialogOpen(true)}>
        <FilePenLine className="h-6 w-6 text-muted-foreground" />
      </Button>
      <HymnMultiLanguageDialog hymn={hymn} onToggle={toggleLanguageSelector} />
    </>
  );

  if (!hymn) { 
    // This can happen if initialHymn is somehow undefined or if localStorage fails unexpectedly
    return <div>Loading hymn...</div>;
  }

  return (
    <>
      <AppHeader
        title={
          // Title can be a ReactNode, so allow for complex elements or simple strings.
          // For this page, it's the "Back to Hymnal" button.
          <Button asChild variant="outline" size="sm">
            <Link href="/hymnal">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hymnal
            </Link>
          </Button>
        }
        actions={hymn.pageNumber ? headerActions : null} // Only show actions if there's a page number
        hideDefaultActions={true} // Hide default AppHeader actions (like Wifi, Menu)
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
            className="pt-0 flex-1 min-h-0" // Ensure form takes available space and scrolls
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
