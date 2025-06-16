
import AppHeader from '@/components/layout/AppHeader';
import HymnDetail from '@/components/hymnal/HymnDetail';
import { sampleHymns } from '@/data/hymns';
import type { Hymn } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {notFound} from 'next/navigation';

interface HymnPageProps {
  params: { id: string };
}

// This function can be a server component
async function getHymn(id: string): Promise<Hymn | undefined> {
  // In a real app, fetch from DB/API
  return sampleHymns.find((h) => h.id === id);
}

export async function generateMetadata({ params }: HymnPageProps) {
  const hymn = await getHymn(params.id);
  if (!hymn) {
    return { title: 'Hymn Not Found' };
  }
  return { title: hymn.titleEnglish }; // Use English title for metadata
}

export default async function HymnPage({ params }: HymnPageProps) {
  const hymn = await getHymn(params.id);

  if (!hymn) {
    notFound();
  }

  return (
    <>
      <AppHeader 
        title="Hymn Detail" 
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/hymnal">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hymnal
            </Link>
          </Button>
        }
      />
      <div className="container mx-auto px-4 pb-8">
        <HymnDetail hymn={hymn} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return sampleHymns.map(hymn => ({
    id: hymn.id,
  }));
}
