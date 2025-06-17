
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

export default function HymnList({ initialHymns }: HymnListProps) {
  const [hymns, setHymns] = useState<Hymn[]>(initialHymns);
  const [isLoading, setIsLoading] = useState(true); // To manage loading state

  useEffect(() => {
    let loadedHymns: Hymn[] = [];
    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const parsedHymns: Hymn[] = JSON.parse(storedHymnsString);
        // Filter for valid hymns before setting state
        loadedHymns = parsedHymns.filter(h => h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
      } else {
        // If nothing in localStorage, use initialHymns prop (already filtered by server or should be valid)
        // And prime localStorage with valid hymns from the prop
        const validInitialHymns = initialHymns.filter(h => h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(validInitialHymns));
        loadedHymns = validInitialHymns;
      }
    } catch (error) {
      console.error("Error loading or parsing hymns from localStorage for list:", error);
      // Fallback to initial props, ensuring they are also filtered for validity
      loadedHymns = initialHymns.filter(h => h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
    }
    
    // Sort the loaded (and filtered) hymns
    const sortedHymns = [...loadedHymns].sort((a, b) => {
        const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
        const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
        if (isNaN(pageNumA) && isNaN(pageNumB)) return 0;
        if (isNaN(pageNumA)) return 1;
        if (isNaN(pageNumB)) return -1;
        return pageNumA - pageNumB;
    });

    setHymns(sortedHymns);
    setIsLoading(false);
  }, [initialHymns]); // Rerun if initialHymns prop changes

  if (isLoading) {
    return <p className="text-muted-foreground">Loading hymns...</p>;
  }

  if (!hymns || hymns.length === 0) {
    return <p className="text-muted-foreground">No hymns available.</p>;
  }

  return (
    <div className="space-y-4">
      {hymns.map((hymn) => (
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
                  {hymn.titleEnglish && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {hymn.titleEnglish}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
