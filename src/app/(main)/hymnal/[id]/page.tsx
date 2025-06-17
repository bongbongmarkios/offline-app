// This is now a Server Component
import { sampleHymns } from '@/data/hymns';
import HymnInteractiveView from '@/components/hymnal/HymnInteractiveView'; // New client component
import { notFound } from 'next/navigation';
import type { Hymn } from '@/types';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return sampleHymns.map(hymn => ({
    id: hymn.id,
  }));
}

async function getHymn(id: string): Promise<Hymn | undefined> {
  // In a real app, this would fetch from a database
  // Simulating async fetch
  return sampleHymns.find((h) => h.id === id);
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

export default async function HymnPageServerWrapper({ params }: { params: { id: string } }) {
  const hymn = await getHymn(params.id);

  if (!hymn) {
    notFound();
  }

  return <HymnInteractiveView hymn={hymn} />;
}
