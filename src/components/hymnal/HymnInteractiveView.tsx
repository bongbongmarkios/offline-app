
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Hymn } from '@/types';
import AppHeader from '@/components/layout/AppHeader';
import HymnDetail from '@/components/hymnal/HymnDetail';
import HymnMultiLanguageDialog from '@/components/hymnal/HymnMultiLanguageDialog';
import EditHymnForm from '@/components/hymnal/EditHymnForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, FilePenLine, Music, Play, Pause } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { initialSampleHymns, updateSampleHymn } from '@/data/hymns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type LanguageOption = 'hiligaynon' | 'filipino' | 'english';
const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

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
  const { toast } = useToast();

  const [isUrlEditDialogOpen, setIsUrlEditDialogOpen] = useState(false);
  const [urlInputForDialog, setUrlInputForDialog] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);


  const languageTitleIsAvailable = (lang: LanguageOption, currentHymn: Hymn | null): boolean => {
    if (!currentHymn) return false;
    switch (lang) {
      case 'hiligaynon':
        return !!currentHymn.titleHiligaynon;
      case 'filipino':
        return !!currentHymn.titleFilipino;
      case 'english':
        return !!currentHymn.titleEnglish;
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
        const hymnFromStorage = storedHymns.find(h => h && typeof h.id === 'string' && h.id === params.id);
        if (hymnFromStorage) {
          resolvedHymn = hymnFromStorage;
        } else {
          resolvedHymn = hymnFromServer || null;
        }
      } else {
        const allInitialHymnsForStorage = [...initialSampleHymns];
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(allInitialHymnsForStorage));
        const currentHymnFromPrimedData = allInitialHymnsForStorage.find(h => h && typeof h.id === 'string' && h.id === params.id);
        resolvedHymn = currentHymnFromPrimedData || hymnFromServer || null;
      }
    } catch (error) {
      console.error("Error loading hymn for interactive view:", error);
      resolvedHymn = hymnFromServer || null;
    }

    setHymn(resolvedHymn);
    setIsLoading(false);
  }, [params.id, hymnFromServer]);


  useEffect(() => {
    if (hymn) {
      if (languageTitleIsAvailable('hiligaynon', hymn)) {
        setSelectedLanguage('hiligaynon');
      } else if (languageTitleIsAvailable('english', hymn)) {
        setSelectedLanguage('english');
      } else if (languageTitleIsAvailable('filipino', hymn)) {
        setSelectedLanguage('filipino');
      } else {
        setSelectedLanguage('hiligaynon');
      }
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
    router.refresh();
  };

  const handleOpenUrlEditDialog = () => {
    if (hymn) {
      setUrlInputForDialog(hymn.externalUrl || '');
      setIsUrlEditDialogOpen(true);
    }
  };

  const handleSaveUrl = () => {
    if (!hymn) return;

    const newExternalUrl = urlInputForDialog.trim() || undefined;
    const updatedHymnData: Hymn = { ...hymn, externalUrl: newExternalUrl };

    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      let allHymnsForStorage: Hymn[];

      if (storedHymnsString) {
        try {
          allHymnsForStorage = JSON.parse(storedHymnsString);
        } catch (parseError) {
          console.error("Error parsing hymns from localStorage, re-initializing with initial set:", parseError);
          allHymnsForStorage = [...initialSampleHymns];
        }
      } else {
        allHymnsForStorage = [...initialSampleHymns];
      }

      const hymnIndex = allHymnsForStorage.findIndex(h => h && typeof h.id === 'string' && h.id === hymn.id);
      if (hymnIndex > -1) {
        allHymnsForStorage[hymnIndex] = updatedHymnData;
      } else {
        allHymnsForStorage.push(updatedHymnData);
      }
      localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(allHymnsForStorage));
      updateSampleHymn(hymn.id, { externalUrl: newExternalUrl });

    } catch (error) {
      console.error("Error saving URL to localStorage:", error);
      toast({ title: "Storage Error", description: "Could not save URL to local storage. Please try again.", variant: "destructive" });
      return;
    }

    setHymn(updatedHymnData);
    toast({ title: "URL Updated", description: "The audio URL has been saved successfully." });
    setIsUrlEditDialogOpen(false);
    // If URL was removed and audio was playing, it will be stopped by the useEffect below
    // If a new URL was added, the useEffect below will load it.
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (hymn?.externalUrl) {
        // Ensure src is current and load if necessary
        if (audioRef.current.src !== hymn.externalUrl) {
          audioRef.current.src = hymn.externalUrl;
          audioRef.current.load(); // Important: load the source before attempting to play
        }
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            toast({
              title: "Playback Error",
              description: "Could not play audio. Check URL, network, or browser permissions.",
              variant: "destructive"
            });
            setIsPlaying(false);
          });
      } else {
        // No URL, so open the dialog to add one
        handleOpenUrlEditDialog();
      }
    }
  };
  

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (hymn?.externalUrl) {
        if (audioElement.src !== hymn.externalUrl) {
          audioElement.src = hymn.externalUrl;
          audioElement.load();
          // If it was playing, and URL changed, we might want to stop it or attempt to play new one.
          // For now, changing src and calling load() implies user might need to press play again.
          // If audio was playing, and URL is removed, stop it.
          if (isPlaying && !hymn.externalUrl) {
            audioElement.pause();
            setIsPlaying(false);
          }
        }
      } else {
        // No external URL, clear src and stop playback
        audioElement.src = '';
        if (isPlaying) {
          audioElement.pause();
          setIsPlaying(false);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hymn?.externalUrl]); // isPlaying is intentionally omitted from deps to avoid loops

  const onAudioEnded = () => {
    setIsPlaying(false);
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
          <p className="text-muted-foreground mb-6">The hymn with ID "{params.id}" could not be found in your local data or initial set.</p>
          <Button asChild>
            <Link href="/hymnal">Return to Hymnal List</Link>
          </Button>
        </div>
      </>
    );
  }

  const headerActions = (
    <>
      {hymn && hymn.externalUrl ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause className="h-6 w-6 text-primary" /> : <Play className="h-6 w-6 text-primary" />}
        </Button>
      ) : (
        <Button variant="ghost" size="icon" aria-label="Add/Edit audio URL" onClick={handleOpenUrlEditDialog}>
          <Music className="h-6 w-6 text-muted-foreground" />
        </Button>
      )}
      <Button variant="ghost" size="icon" aria-label="Edit hymn details" onClick={() => setIsEditDialogOpen(true)}>
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

      <Dialog open={isUrlEditDialogOpen} onOpenChange={setIsUrlEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Audio URL</DialogTitle>
            <DialogDescription>
              Enter or update the MP3 URL for this hymn. Leave blank to remove the URL.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hymn-url-edit-dialog" className="text-right col-span-1">
                URL
              </Label>
              <Input
                id="hymn-url-edit-dialog"
                value={urlInputForDialog}
                onChange={(e) => setUrlInputForDialog(e.target.value)}
                placeholder="e.g., https://example.com/audio.mp3"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUrlEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUrl}>Save URL</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <audio ref={audioRef} preload="metadata" onEnded={onAudioEnded} />
    </>
  );
}
