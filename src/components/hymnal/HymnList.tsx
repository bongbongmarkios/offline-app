
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
    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const storedHymnsFromStorage: Hymn[] = JSON.parse(storedHymnsString);
        // Sort here as well, similar to the server page
        const sortedHymns = [...storedHymnsFromStorage].sort((a, b) => {
            const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
            const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
            if (isNaN(pageNumA) && isNaN(pageNumB)) return 0;
            if (isNaN(pageNumA)) return 1;
            if (isNaN(pageNumB)) return -1;
            return pageNumA - pageNumB;
        });
        setHymns(sortedHymns);
      } else {
        // If nothing in localStorage, use initialHymns (already sorted by server)
        // And potentially prime localStorage with the initial set
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(initialSampleHymns));
        setHymns(initialHymns); 
      }
    } catch (error) {
      console.error("Error loading hymns from localStorage for list:", error);
      setHymns(initialHymns); // Fallback to initial props on error
    }
    setIsLoading(false);
  }, [initialHymns]); // Rerun if initialHymns prop changes, though it shouldn't frequently

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
                    {hymn.titleHiligaynon.toUpperCase()}
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
