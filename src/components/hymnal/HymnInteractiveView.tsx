
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
import { initialSampleHymns, updateSampleHymn } from '@/data/hymns'; 

type LanguageOption = 'hiligaynon' | 'filipino' | 'english';
const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

type SignalStrength = 'strong' | 'average' | 'weak' | 'none';

interface HymnInteractiveViewProps {
  hymnFromServer?: Hymn; // Optional: hymn data from server (might be undefined)
  params: { id: string };   // Route params to get the ID
}

export default function HymnInteractiveView({ hymnFromServer, params }: HymnInteractiveViewProps) {
  const [hymn, setHymn] = useState<Hymn | null>(null); // Allow null for not found state
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>('hiligaynon');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  const [signalStrength, setSignalStrength] = useState<SignalStrength>('strong');

  useEffect(() => {
    setIsLoading(true);
    let resolvedHymn: Hymn | null = null;

    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const storedHymns: Hymn[] = JSON.parse(storedHymnsString);
        const hymnFromStorage = storedHymns.find(h => h.id === params.id);
        if (hymnFromStorage) {
          resolvedHymn = hymnFromStorage; // Prioritize localStorage
        } else if (hymnFromServer) { // Not in localStorage, but was passed from server
          resolvedHymn = hymnFromServer;
        }
        // If not in storage and not from server, resolvedHymn remains null
      } else {
        // localStorage is empty.
        // Use hymnFromServer if available, otherwise it's not found for this ID.
        resolvedHymn = hymnFromServer || null;
        // Initialize localStorage with the base set.
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(initialSampleHymns));
      }
    } catch (error) {
      console.error("Error loading hymn:", error);
      // On error, fallback to hymnFromServer if it exists, otherwise null.
      resolvedHymn = hymnFromServer || null;
    }

    setHymn(resolvedHymn);
    setIsLoading(false);
  }, [params.id, hymnFromServer]);


  useEffect(() => {
    if (hymn) {
      if (languageIsAvailable('hiligaynon', hymn)) {
        setSelectedLanguage('hiligaynon');
      } else if (languageIsAvailable('english', hymn)) {
        setSelectedLanguage('english');
      } else if (languageIsAvailable('filipino', hymn)) {
        setSelectedLanguage('filipino');
      } else {
        setSelectedLanguage('hiligaynon');
      }
    }
    setShowLanguageSelector(false);
  }, [hymn]);

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

  const languageIsAvailable = (lang: LanguageOption, currentHymn: Hymn | null): boolean => {
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

  if (isLoading) {
    return (
      <>
        <AppHeader 
          title={
            <Button asChild variant="outline" size="sm" disabled>
              <Link href="/hymnal">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </Button>
          } 
          hideDefaultActions={true} 
        />
        <div className="container mx-auto px-4 pb-8 text-center py-10 text-muted-foreground">Loading hymn details...</div>
      </>
    );
  }

  if (!hymn) {
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
          hideDefaultActions={true} 
        />
        <div className="container mx-auto px-4 pb-8 text-center py-10">
          <h2 className="text-2xl font-semibold mb-4 text-destructive">Hymn Not Found</h2>
          <p className="text-muted-foreground mb-6">The hymn with ID "{params.id}" could not be found in your local data.</p>
          <Button asChild>
            <Link href="/hymnal">Return to Hymnal List</Link>
          </Button>
        </div>
      </>
    );
  }

  // Hymn is loaded and not null at this point
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
