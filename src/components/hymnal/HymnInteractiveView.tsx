
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
  hymnFromServer?: Hymn; 
  params: { id: string };   
}

export default function HymnInteractiveView({ hymnFromServer, params }: HymnInteractiveViewProps) {
  const [hymn, setHymn] = useState<Hymn | null>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>('hiligaynon');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  const [signalStrength, setSignalStrength] = useState<SignalStrength>('strong');

  // Refined languageIsAvailable for HymnInteractiveView
  const languageIsAvailable = (lang: LanguageOption, currentHymn: Hymn | null): boolean => {
    if (!currentHymn) return false;
    switch (lang) {
      case 'hiligaynon': // Hiligaynon title is required for the hymn to be valid
        return !!currentHymn.titleHiligaynon; // Lyrics are also required by type, so title check is enough
      case 'filipino':   // Filipino is optional
        return !!currentHymn.titleFilipino && !!currentHymn.lyricsFilipino; // Both title and actual lyrics must exist and be non-empty
      case 'english':    // English title is required for the hymn to be valid
        return !!currentHymn.titleEnglish; // lyricsEnglish is a string, can be empty, still "available" if title exists
      default:
        return false;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    let resolvedHymn: Hymn | null = null;

    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const storedHymns: Hymn[] = JSON.parse(storedHymnsString);
        const hymnFromStorage = storedHymns.find(h => h.id === params.id);
        if (hymnFromStorage) {
          resolvedHymn = hymnFromStorage; 
        } else if (hymnFromServer) { 
          resolvedHymn = hymnFromServer;
        }
      } else {
        resolvedHymn = hymnFromServer || null;
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(initialSampleHymns));
      }
    } catch (error) {
      console.error("Error loading hymn:", error);
      resolvedHymn = hymnFromServer || null;
    }

    setHymn(resolvedHymn);
    setIsLoading(false);
  }, [params.id, hymnFromServer]);


  useEffect(() => {
    if (hymn) {
      // Set initial language based on availability, preferring Hiligaynon, then English
      if (languageIsAvailable('hiligaynon', hymn)) {
        setSelectedLanguage('hiligaynon');
      } else if (languageIsAvailable('english', hymn)) {
        setSelectedLanguage('english');
      } else if (languageIsAvailable('filipino', hymn)) {
        setSelectedLanguage('filipino');
      } else {
        setSelectedLanguage('hiligaynon'); // Default fallback
      }
    }
    setShowLanguageSelector(false); // Reset selector visibility when hymn changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hymn]); // Removed languageIsAvailable from deps as it's stable if hymn is its only external dep

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
