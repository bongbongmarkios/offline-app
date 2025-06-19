
'use client';

import { useState, useEffect, useRef, type MouseEvent } from 'react';
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
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);


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
          if (hymnFromServer) {
            resolvedHymn = hymnFromServer;
            const newStorageHymns = [...storedHymns.filter(h => h.id !== hymnFromServer.id), hymnFromServer];
            localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(newStorageHymns));
          } else {
            resolvedHymn = null;
          }
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

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleLoadedMetadata = () => {
      if (audioElement.duration && isFinite(audioElement.duration)) {
        setAudioDuration(audioElement.duration);
      } else {
        setAudioDuration(0);
      }
      setIsLoadingAudio(false);
    };
    const handleTimeUpdate = () => {
      setAudioCurrentTime(audioElement.currentTime);
    };
    const handleCanPlay = () => {
      setIsLoadingAudio(false);
    };
    const handleError = (e: Event) => {
      console.error("Audio Error in event listener:", e);
      setIsLoadingAudio(false);
      setIsPlaying(false);
      if (audioElement.src && audioElement.src !== window.location.href) {
        toast({
            title: "Audio Playback Error",
            description: "Could not load the audio. Please check the URL or network.",
            variant: "destructive",
        });
      }
    };
    const onAudioEnded = () => {
        setIsPlaying(false);
        setAudioCurrentTime(0); 
    };


    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('canplay', handleCanPlay);
    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('ended', onAudioEnded);


    if (hymn?.externalUrl) {
      if (audioElement.src !== hymn.externalUrl) {
        audioElement.src = hymn.externalUrl;
        setIsLoadingAudio(true);
        setAudioCurrentTime(0);
        setAudioDuration(0);
        audioElement.load();
      }
    } else {
      if (audioElement.src) { 
         audioElement.pause();
         audioElement.removeAttribute('src');
         audioElement.load(); 
      }
      setIsPlaying(false);
      setAudioCurrentTime(0);
      setAudioDuration(0);
      setIsLoadingAudio(false);
    }

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('canplay', handleCanPlay);
      audioElement.removeEventListener('error', handleError);
      audioElement.removeEventListener('ended', onAudioEnded);
    };
  }, [hymn?.externalUrl, toast]);


  const toggleLanguageSelector = () => {
    setShowLanguageSelector(prev => !prev);
  };

  const handleSelectLanguage = (language: LanguageOption) => {
    setSelectedLanguage(language);
  };

  const handleEditSuccess = (updatedHymnData: Hymn) => {
    setHymn(updatedHymnData);
    setIsEditDialogOpen(false);
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
  };

 const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (!hymn?.externalUrl) {
      handleOpenUrlEditDialog();
      return;
    }

    if (isLoadingAudio && audioRef.current.readyState < audioRef.current.HAVE_METADATA) {
      toast({ title: "Audio Loading", description: "Please wait, audio is preparing." });
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.src !== hymn.externalUrl) {
        audioRef.current.src = hymn.externalUrl;
        setIsLoadingAudio(true); 
        audioRef.current.load();
      }
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false); 
        })
        .catch(error => {
          console.error("Error playing audio in togglePlayPause:", error);
          setIsLoadingAudio(false);
          setIsPlaying(false);
          toast({
            title: "Playback Error",
            description: "Could not play audio. Check URL, network, or browser permissions.",
            variant: "destructive"
          });
        });
    }
  };

  const handleSeek = (event: MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || audioDuration === 0) {
      return;
    }
  
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = progressBar.offsetWidth;
  
    if (width === 0) return;
  
    let percentage = clickX / width;
    percentage = Math.max(0, Math.min(1, percentage)); 
  
    const newTime = percentage * audioDuration;
    audioRef.current.currentTime = newTime;
    setAudioCurrentTime(newTime); 
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

  const progressPercentage = audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0;

  const playerControlContent = (
    <div className="flex items-center gap-2">
      {hymn.externalUrl && audioDuration > 0 && ( 
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          className="relative h-2 w-24 bg-muted rounded-full overflow-hidden group cursor-pointer"
          title={`Progress: ${Math.round(progressPercentage)}% (click to seek)`}
        >
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-[width] ease-linear duration-150"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlayPause}
        aria-label={
          hymn.externalUrl
            ? (isLoadingAudio && audioRef.current?.readyState < audioRef.current?.HAVE_METADATA ? "Loading audio..." : isPlaying ? "Pause audio" : "Play audio")
            : "Add/Edit audio URL"
        }
        disabled={!!(hymn.externalUrl && isLoadingAudio && audioRef.current?.readyState < audioRef.current?.HAVE_METADATA && !isPlaying)}
        className="flex-shrink-0"
      >
        {hymn.externalUrl ? (
          isPlaying ? <Pause className="h-6 w-6 text-primary" /> : <Play className="h-6 w-6 text-primary" />
        ) : (
          <Music className="h-6 w-6 text-muted-foreground" />
        )}
      </Button>
    </div>
  );


  const headerActions = hymn.pageNumber ? ( 
    <>
      {playerControlContent}
      <Button variant="ghost" size="icon" aria-label="Edit hymn details" onClick={() => setIsEditDialogOpen(true)}>
        <FilePenLine className="h-6 w-6 text-muted-foreground" />
      </Button>
      <HymnMultiLanguageDialog hymn={hymn} onToggle={toggleLanguageSelector} />
    </>
  ) : null;

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
        actions={headerActions}
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
              Enter or update the audio URL for this hymn (e.g., MP3 link). Leave blank to remove.
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

      <audio ref={audioRef} preload="metadata" />
    </>
  );
}
