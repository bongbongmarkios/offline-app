'use client';

import * as React from 'react';
import type { Hymn } from '@/types';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { initialSampleHymns } from '@/data/hymns';
import { FileMusic, Loader2 } from 'lucide-react';

const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

interface HymnSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function HymnSearchDialog({ open, onOpenChange }: HymnSearchDialogProps) {
  const [hymns, setHymns] = React.useState<Hymn[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (open) {
        setIsLoading(true);
        let loadedHymns: Hymn[] = [];
        try {
            const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
            if (storedHymnsString) {
                loadedHymns = JSON.parse(storedHymnsString);
            } else {
                loadedHymns = [...initialSampleHymns];
            }
        } catch (error) {
            console.error("Error loading hymns for search:", error);
            loadedHymns = [...initialSampleHymns];
        }
        setHymns(loadedHymns);
        setIsLoading(false);
    }
  }, [open]);

  const runCommand = React.useCallback((command: () => unknown) => {
    onOpenChange(false)
    command()
  }, [onOpenChange]);

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title="Search Hymns"
      description="Search for hymns by title, page number, or lyrics."
    >
      <CommandInput placeholder="Search hymns by title, page number, or lyrics..." />
      <CommandList>
        {isLoading ? (
            <div className="p-4 text-sm text-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin inline mr-2"/>
                Loading hymns...
            </div>
        ) : (
            <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Hymns">
                {hymns.map((hymn) => (
                    <CommandItem
                        key={hymn.id}
                        value={`${hymn.titleHiligaynon} ${hymn.titleEnglish} ${hymn.titleFilipino || ''} ${hymn.pageNumber || ''} ${hymn.lyricsHiligaynon} ${hymn.lyricsEnglish} ${hymn.lyricsFilipino || ''}`}
                        onSelect={() => {
                            runCommand(() => router.push(`/hymnal/${hymn.id}`))
                        }}
                    >
                        <FileMusic className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                            <span className="font-medium">{hymn.titleHiligaynon || hymn.titleEnglish}</span>
                            {hymn.titleEnglish && hymn.titleEnglish !== hymn.titleHiligaynon && <span className="text-xs text-muted-foreground">{hymn.titleEnglish}</span>}
                        </div>
                        {hymn.pageNumber && <span className="ml-auto text-xs text-muted-foreground">#{hymn.pageNumber}</span>}
                    </CommandItem>
                ))}
                </CommandGroup>
            </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
