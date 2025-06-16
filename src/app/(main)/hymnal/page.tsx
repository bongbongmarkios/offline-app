
import AppHeader from '@/components/layout/AppHeader';
import HymnList from '@/components/hymnal/HymnList';
import { sampleHymns } from '@/data/hymns';
import type { Hymn } from '@/types';

// This page can be a server component as it just fetches/defines data
export default async function HymnalPage() {
  // In a real app, you'd fetch hymns from a database or API
  const hymns: Hymn[] = [...sampleHymns].sort((a, b) => {
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
        <HymnList hymns={hymns} />
      </div>
    </>
  );
}
