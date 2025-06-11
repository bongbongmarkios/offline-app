import AppHeader from '@/components/layout/AppHeader';
import HymnList from '@/components/hymnal/HymnList';
import { sampleHymns } from '@/data/hymns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

// This page can be a server component as it just fetches/defines data
export default async function HymnalPage() {
  // In a real app, you'd fetch hymns from a database or API
  const hymns = sampleHymns;

  return (
    <>
      <AppHeader 
        title="Hymnal" 
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/hymnal/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Hymn
            </Link>
          </Button>
        }
      />
      <div className="container mx-auto px-4 pb-8">
        <HymnList hymns={hymns} />
      </div>
    </>
  );
}
