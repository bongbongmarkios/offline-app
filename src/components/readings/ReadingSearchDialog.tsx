'use client';

import * as React from 'react';
import type { Reading } from '@/types';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { sampleReadings } from '@/data/readings';
import { BookText, Loader2 } from 'lucide-react';

const LOCAL_STORAGE_READINGS_KEY = 'graceNotesReadings';

interface ReadingSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ReadingSearchDialog({ open, onOpenChange }: ReadingSearchDialogProps) {
  const [readings, setReadings] = React.useState<Reading[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (open) {
        setIsLoading(true);
        let loadedReadings: Reading[] = [];
        try {
            const storedReadingsString = localStorage.getItem(LOCAL_STORAGE_READINGS_KEY);
            if (storedReadingsString) {
                loadedReadings = JSON.parse(storedReadingsString);
            } else {
                loadedReadings = [...sampleReadings];
            }
        } catch (error) {
            console.error("Error loading readings for search:", error);
            loadedReadings = [...sampleReadings];
        }
        setReadings(loadedReadings);
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
        title="Search Readings"
        description="Search for readings by title, page number, or content."
    >
      <CommandInput placeholder="Search readings by title, page, or content..." />
      <CommandList>
        {isLoading ? (
            <div className="p-4 text-sm text-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin inline mr-2"/>
                Loading readings...
            </div>
        ) : (
            <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Readings">
                {readings.map((reading) => (
                    <CommandItem
                        key={reading.id}
                        value={`${reading.title} ${reading.pageNumber || ''} ${reading.source || ''} ${reading.lyrics}`}
                        onSelect={() => {
                            runCommand(() => router.push(`/readings/${reading.id}`))
                        }}
                    >
                        <BookText className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                            <span className="font-medium">{reading.title}</span>
                            {reading.source && <span className="text-xs text-muted-foreground">{reading.source}</span>}
                        </div>
                        {reading.pageNumber && <span className="ml-auto text-xs text-muted-foreground">p. {reading.pageNumber}</span>}
                    </CommandItem>
                ))}
                </CommandGroup>
            </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
