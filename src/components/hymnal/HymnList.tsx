
'use client';
import type { Hymn } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState, useCallback } from 'react';

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
        parsedStoredHymns.forEach(h => mergedHymnsMap.set(h.id, h));
        
        validInitialHymnsFromProp.forEach(h => {
          if (!mergedHymnsMap.has(h.id)) {
            mergedHymnsMap.set(h.id, h);
          }
        });
        finalHymnsToDisplay = Array.from(mergedHymnsMap.values());
        
        const sortedFinalForStorage = [...finalHymnsToDisplay].sort((a,b) => a.id.localeCompare(b.id));
        const sortedParsedFromStorage = [...parsedStoredHymns].sort((a,b) => a.id.localeCompare(b.id));

        if (JSON.stringify(sortedFinalForStorage) !== JSON.stringify(sortedParsedFromStorage)) {
            localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(sortedFinalForStorage));
        }

      } else {
        finalHymnsToDisplay = validInitialHymnsFromProp;
        if (finalHymnsToDisplay.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(finalHymnsToDisplay));
        }
      }
    } catch (error) {
      console.error("Error processing hymns from localStorage or props:", error);
      finalHymnsToDisplay = validInitialHymnsFromProp;
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
  }, [initialHymns]);

  useEffect(() => {
    loadAndSetHymns();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_HYMNS_KEY || event.key === null) {
        loadAndSetHymns();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadAndSetHymns]);

  if (isLoading) {
    return <p className="text-muted-foreground text-center py-4">Loading hymns...</p>;
  }

  if (!hymns || hymns.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No hymns available.</p>;
  }

  return (
    <div className="space-y-4">
      {hymns.map((hymn) => {
        if (isValidHymn(hymn)) {
          const hymnIdTrimmed = hymn.id.trim(); 
          if (hymnIdTrimmed.length > 0) { // Explicitly check for non-empty ID
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
        }
        return null; 
      })}
    </div>
  );
}
