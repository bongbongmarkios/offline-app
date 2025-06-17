
'use client';
import type { Hymn } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { initialSampleHymns as fallbackInitialHymns } from '@/data/hymns'; // Renamed for clarity

const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

const isValidHymn = (h: Hymn | undefined | null): h is Hymn => {
  return !!(h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
};

interface HymnListProps {
  initialHymns: Hymn[]; // These are from the server/code, potentially updated
}

export default function HymnList({ initialHymns }: HymnListProps) {
  const [hymns, setHymns] = useState<Hymn[]>(() => initialHymns.filter(isValidHymn));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let finalHymnsToDisplay: Hymn[] = [];
    const validInitialHymnsFromProp = initialHymns.filter(isValidHymn);

    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const parsedStoredHymns: Hymn[] = JSON.parse(storedHymnsString).filter(isValidHymn);
        
        // Merge strategy:
        // Start with stored hymns.
        // Add any hymns from props (code's initialSampleHymns) that are not in stored hymns.
        const mergedHymnsMap = new Map<string, Hymn>();
        parsedStoredHymns.forEach(h => mergedHymnsMap.set(h.id, h));
        
        validInitialHymnsFromProp.forEach(h => {
          if (!mergedHymnsMap.has(h.id)) {
            // If a hymn from code isn't in localStorage, add it.
            // This ensures new "initial" hymns from code updates appear.
            mergedHymnsMap.set(h.id, h);
          }
          // If you want code changes to overwrite localStorage for matching IDs:
          // else { mergedHymnsMap.set(h.id, h); } 
          // But current logic preserves localStorage version if ID exists.
        });
        finalHymnsToDisplay = Array.from(mergedHymnsMap.values());
        
        // Save the potentially updated merged list back to localStorage
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(finalHymnsToDisplay));
      } else {
        // localStorage is empty, use initial hymns from props and prime localStorage
        finalHymnsToDisplay = validInitialHymnsFromProp;
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(finalHymnsToDisplay));
      }
    } catch (error) {
      console.error("Error processing hymns from localStorage or props:", error);
      // Fallback to initial hymns from props if any error occurs during processing
      finalHymnsToDisplay = validInitialHymnsFromProp;
      // Attempt to prime localStorage even on error, with the props data
      try {
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(finalHymnsToDisplay));
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
  }, [initialHymns]); // Rerun if initialHymns prop changes

  if (isLoading) {
    return <p className="text-muted-foreground text-center py-4">Loading hymns...</p>;
  }

  if (!hymns || hymns.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No hymns available.</p>;
  }

  return (
    <div className="space-y-4">
      {hymns.map((hymn) => {
        if (hymn && typeof hymn.id === 'string' && hymn.id.trim() !== "") {
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

