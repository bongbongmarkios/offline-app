
import AppHeader from '@/components/layout/AppHeader';
import HymnList from '@/components/hymnal/HymnList';
import { sampleHymns } from '@/data/hymns';

// This page can be a server component as it just fetches/defines data
export default async function HymnalPage() {
  // In a real app, you'd fetch hymns from a database or API
  const hymns = sampleHymns;

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
