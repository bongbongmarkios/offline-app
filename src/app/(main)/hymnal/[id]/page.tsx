
// This is now a Server Component
import { initialSampleHymns } from '@/data/hymns'; // Use initialSampleHymns
import HymnInteractiveView from '@/components/hymnal/HymnInteractiveView';
import { notFound } from 'next/navigation';
import type { Hymn } from '@/types';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  // generateStaticParams should use the initial set of hymns known at build time
  return initialSampleHymns.map(hymn => ({
    id: hymn.id,
  }));
}

async function getHymn(id: string): Promise<Hymn | undefined> {
  // This server-side fetch uses the initialSampleHymns.
  // The client component (HymnInteractiveView) will handle localStorage.
  return initialSampleHymns.find((h) => h.id === id);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const hymn = await getHymn(params.id);
  if (!hymn) {
    return {
      title: 'Hymn Not Found | GraceNotes',
    };
  }
  const displayTitle = hymn.titleEnglish || hymn.titleHiligaynon;
  return {
    title: `${displayTitle} | GraceNotes`,
  };
}

// This Server Component fetches the data and passes it to the Client Component
export default async function HymnPageServerWrapper({ params }: { params: { id: string } }) {
  const hymn = await getHymn(params.id);

  if (!hymn) {
    notFound();
  }

  // Pass hymn as initialHymn to the client component.
  // HymnInteractiveView will then check localStorage for any updates to this hymn.
  return <HymnInteractiveView initialHymn={hymn} />;
}
