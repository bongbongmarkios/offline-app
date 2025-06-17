
'use client';
import type { Hymn } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState, useCallback } from 'react';
// No need to import fallbackInitialHymns as initialHymns prop is the source of truth from server.

const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

const isValidHymn = (h: Hymn | undefined | null): h is Hymn => {
  return !!(h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
};

interface HymnListProps {
  initialHymns: Hymn[]; 
}

export default function HymnList({ initialHymns }: HymnListProps) {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAndSetHymns = useCallback(() => {
    setIsLoading(true);
    let finalHymnsToDisplay: Hymn[] = [];
    const validInitialHymnsFromProp = initialHymns.filter(isValidHymn);

    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const parsedStoredHymns: Hymn[] = JSON.parse(storedHymnsString).filter(isValidHymn);
        
        const mergedHymnsMap = new Map<string, Hymn>();
        // Prioritize hymns from localStorage as they might have user edits (like URLs)
        parsedStoredHymns.forEach(h => mergedHymnsMap.set(h.id, h));
        
        // Add any hymns from props (code's initialSampleHymns) that are not in stored hymns.
        // This ensures new hymns added to code appear.
        validInitialHymnsFromProp.forEach(h => {
          if (!mergedHymnsMap.has(h.id)) {
            mergedHymnsMap.set(h.id, h);
          }
          // Optional: If you want code changes to *always* overwrite localStorage for matching IDs:
          // else { mergedHymnsMap.set(h.id, h); }
        });
        finalHymnsToDisplay = Array.from(mergedHymnsMap.values());
        
        // If the merge resulted in a list different from what was in localStorage, update localStorage.
        // This typically happens if new hymns from code were added.
        if (JSON.stringify(finalHymnsToDisplay.sort((a,b) => a.id.localeCompare(b.id))) !== JSON.stringify(parsedStoredHymns.sort((a,b) => a.id.localeCompare(b.id)))) {
            localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(finalHymnsToDisplay));
        }

      } else {
        // localStorage is empty, use initial hymns from props and prime localStorage
        finalHymnsToDisplay = validInitialHymnsFromProp;
        if (finalHymnsToDisplay.length > 0) { // Only prime if there's something to prime with
            localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(finalHymnsToDisplay));
        }
      }
    } catch (error) {
      console.error("Error processing hymns from localStorage or props:", error);
      finalHymnsToDisplay = validInitialHymnsFromProp; // Fallback
       // Attempt to prime localStorage even on error, with the props data
      try {
        if (finalHymnsToDisplay.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(finalHymnsToDisplay));
        }
      } catch (lsError) {
        console.error("Error priming localStorage after initial error:", lsError);
      }
    }
    
    const sortedHymns = [...finalHymnsToDisplay].sort((a, b) => {
        const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
        const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
        if (isNaN(pageNumA) && isNaN(pageNumB)) return (a.titleEnglish || a.titleHiligaynon || '').localeCompare(b.titleEnglish || b.titleHiligaynon || '');
        if (isNaN(pageNumA)) return 1;
        if (isNaN(pageNumB)) return -1;
        
        if (pageNumA === pageNumB) {
          return (a.titleEnglish || a.titleHiligaynon || '').localeCompare(b.titleEnglish || b.titleHiligaynon || '');
        }
        return pageNumA - pageNumB;
    });

    setHymns(sortedHymns);
    setIsLoading(false);
  }, [initialHymns]); // Depends on initialHymns prop

  useEffect(() => {
    loadAndSetHymns(); // Call on mount and when initialHymns (and thus loadAndSetHymns) changes

    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change is for the hymns key or if storage was cleared (event.key is null)
      if (event.key === LOCAL_STORAGE_HYMNS_KEY || event.key === null) {
        loadAndSetHymns();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadAndSetHymns]); // Effect hook depends on the memoized loader function

  if (isLoading) {
    return <p className="text-muted-foreground text-center py-4">Loading hymns...</p>;
  }

  if (!hymns || hymns.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No hymns available.</p>;
  }

  return (
    <div className="space-y-4">
      {hymns.map((hymn) => {
        // Using isValidHymn before attempting to render the Link
        if (isValidHymn(hymn)) {
          const hymnIdTrimmed = hymn.id.trim(); 
          return (
            <Link key={hymnIdTrimmed} href={`/hymnal/${hymnIdTrimmed}`} className="block hover:no-underline">
              <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {hymn.pageNumber && (
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex-shrink-0 mt-1">
                        {hymn.pageNumber}
                      </span>
                    )}
                    <div className="flex-grow">
                      <CardTitle className="font-headline text-xl group-hover:text-primary">
                        {hymn.titleHiligaynon ? hymn.titleHiligaynon.toUpperCase() : 'Untitled Hymn'}
                      </CardTitle>
                      {hymn.titleEnglish && hymn.titleEnglish.toUpperCase() !== (hymn.titleHiligaynon || '').toUpperCase() && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {hymn.titleEnglish}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        }
        return null; 
      })}
    </div>
  );
}
