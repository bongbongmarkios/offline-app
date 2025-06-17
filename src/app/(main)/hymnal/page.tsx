
import AppHeader from '@/components/layout/AppHeader';
import HymnList from '@/components/hymnal/HymnList';
import { initialSampleHymns } from '@/data/hymns'; // Use initialSampleHymns
import type { Hymn } from '@/types';

// This page remains a server component for initial load.
// HymnList will be made a client component to fetch from localStorage.
export default async function HymnalPage() {
  // In a real app, you'd fetch hymns from a database or API
  // For initial server render, we use the default set. HymnList will update from localStorage client-side.
  const hymns: Hymn[] = [...initialSampleHymns].sort((a, b) => {
    const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
    const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;

    if (isNaN(pageNumA) && isNaN(pageNumB)) return 0;
    if (isNaN(pageNumA)) return 1; // Place NaNs at the end
    if (isNaN(pageNumB)) return -1; // Place NaNs at the end

    return pageNumA - pageNumB;
  });

  return (
    <>
      <AppHeader 
        title="Hymnal" 
      />
      <div className="container mx-auto px-4 pb-8">
        {/* HymnList will handle its own data fetching from localStorage client-side */}
        {/* Passing initialHymns can be a prop for fallback or initial display before client JS loads */}
        <HymnList initialHymns={hymns} />
      </div>
    </>
  );
}
