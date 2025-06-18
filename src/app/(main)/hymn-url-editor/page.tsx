
'use client';

import AppHeader from '@/components/layout/AppHeader';
import { useEffect, useState } from 'react';
import type { Hymn } from '@/types';
import { initialSampleHymns } from '@/data/hymns';
import StaticHymnListDisplay from '@/components/hymnal/StaticHymnListDisplay';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

// Metadata cannot be exported from Client Components. 
// The title in AppHeader will be set.
// For browser tab title, alternative methods like useEffect would be needed if static export is not an option.

export default function HymnUrlEditorPage() {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hymnsVersion, setHymnsVersion] = useState(0); // For triggering re-fetch
  const router = useRouter();

  const handleUrlUpdated = () => {
    setHymnsVersion(v => v + 1); // Increment version to trigger useEffect, causing re-fetch from localStorage
  };

  useEffect(() => {
    setIsLoading(true);
    let loadedHymns: Hymn[] = [];
    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        const parsedHymns: Hymn[] = JSON.parse(storedHymnsString);
        loadedHymns = parsedHymns.filter(h => h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
      } else {
        // If localStorage is empty, load initial hymns and prime localStorage
        const validInitialHymns = initialSampleHymns.filter(h => h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(validInitialHymns));
        loadedHymns = validInitialHymns;
      }
    } catch (error) {
      console.error("Error loading or parsing hymns from localStorage for URL editor:", error);
      // Fallback to initial hymns if localStorage fails
      loadedHymns = initialSampleHymns.filter(h => h && h.id && typeof h.id === 'string' && h.id.trim() !== "");
    }
    
    // Sort hymns, e.g., by page number
    const sortedHymns = [...loadedHymns].sort((a, b) => {
        const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
        const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
        if (isNaN(pageNumA) && isNaN(pageNumB)) return (a.titleEnglish || '').localeCompare(b.titleEnglish || ''); // Fallback sort by title
        if (isNaN(pageNumA)) return 1; // Hymns without page numbers go to the end
        if (isNaN(pageNumB)) return -1;
        return pageNumA - pageNumB;
    });

    setHymns(sortedHymns);
    setIsLoading(false);
  }, [hymnsVersion]); // Re-run when hymnsVersion changes (e.g., after a URL update)

  const headerTitleContent = (
    <div className="flex items-center w-full">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
        <h1 className="flex-grow text-center mx-4 text-2xl font-headline font-semibold text-primary sm:text-3xl">
            URLs
        </h1>
        <div className="invisible flex-shrink-0"> {/* Spacer to balance the Back button for centering H1 */}
            <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
    </div>
  );


  return (
    <>
      <AppHeader title={headerTitleContent} />
      <div className="container mx-auto px-4 pb-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px] py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Loading hymns...</p>
          </div>
        ) : hymns.length > 0 ? (
          <div className="mt-6"> {/* Added margin for spacing */}
            <StaticHymnListDisplay hymns={hymns} onUrlUpdated={handleUrlUpdated} />
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-10">No hymns available to manage URLs for.</p>
        )}
      </div>
    </>
  );
}
