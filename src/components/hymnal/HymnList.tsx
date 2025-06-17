
'use client';
import type { Hymn } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { initialSampleHymns } from '@/data/hymns'; // For fallback

const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

interface HymnListProps {
  initialHymns: Hymn[]; // For SSR and fallback
}

const isValidHymn = (h: Hymn | undefined | null): h is Hymn => {
  return !!(h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
};

export default function HymnList({ initialHymns }: HymnListProps) {
  // Ensure the initial state from props is also filtered.
  const [hymns, setHymns] = useState<Hymn[]>(() => initialHymns.filter(isValidHymn));
  const [isLoading, setIsLoading] = useState(true); // To manage loading state

  useEffect(() => {
    setIsLoading(true); // Set loading true when effect runs
    let loadedHymns: Hymn[] = [];
    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const parsedHymns: Hymn[] = JSON.parse(storedHymnsString);
        loadedHymns = parsedHymns.filter(isValidHymn);
      } else {
        const validInitialHymnsFromProp = initialHymns.filter(isValidHymn);
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(validInitialHymnsFromProp));
        loadedHymns = validInitialHymnsFromProp;
      }
    } catch (error) {
      console.error("Error loading or parsing hymns from localStorage for list:", error);
      loadedHymns = initialHymns.filter(isValidHymn); // Fallback to filtered initial props
    }
    
    const sortedHymns = [...loadedHymns].sort((a, b) => {
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
  }, [initialHymns]); // Rerun if initialHymns prop changes, which happens on router.refresh after adding

  if (isLoading) {
    // Display a loading state, possibly using skeletons for a better UX
    // For now, simple text:
    return <p className="text-muted-foreground text-center py-4">Loading hymns...</p>;
  }

  if (!hymns || hymns.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No hymns available.</p>;
  }

  return (
    <div className="space-y-4">
      {hymns.map((hymn) => (
        // The check isValidHymn(hymn) should be redundant here if state `hymns` is always filtered
        // but as an extra safeguard for the key and href:
        isValidHymn(hymn) ? (
          <Link key={hymn.id} href={`/hymnal/${hymn.id}`} className="block hover:no-underline">
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
        ) : null 
      ))}
    </div>
  );
}
