
'use client';
import type { Hymn } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { initialSampleHymns } from '@/data/hymns'; // For fallback

const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

const isValidHymn = (h: Hymn | undefined | null): h is Hymn => {
  return !!(h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
};

export default function HymnList({ initialHymns }: HymnListProps) {
  const [hymns, setHymns] = useState<Hymn[]>(() => initialHymns.filter(isValidHymn));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
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
      loadedHymns = initialHymns.filter(isValidHymn);
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
  }, [initialHymns]);

  if (isLoading) {
    return <p className="text-muted-foreground text-center py-4">Loading hymns...</p>;
  }

  if (!hymns || hymns.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No hymns available.</p>;
  }

  return (
    <div className="space-y-4">
      {hymns.map((hymn) => {
        // Explicitly check hymn and hymn.id before rendering the Link
        // This is a reinforcement of isValidHymn for the href generation.
        if (hymn && typeof hymn.id === 'string' && hymn.id.trim() !== "") {
          const hymnIdTrimmed = hymn.id.trim(); // Use trimmed ID for href and key
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
        // If the hymn ID is not valid, render nothing for this item.
        // This case should ideally be caught by the initial filtering of the hymns array.
        return null; 
      })}
    </div>
  );
}
