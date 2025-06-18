
// This is now a Server Component
import { initialSampleHymns } from '@/data/hymns'; // Use initialSampleHymns
import HymnInteractiveView from '@/components/hymnal/HymnInteractiveView';
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
  return initialSampleHymns.find((h) => h.id === id);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const hymn = await getHymn(params.id);
  if (!hymn) {
    return {
      title: 'Hymn | SBC Church App', // Generic title if not found on server
    };
  }
  const displayTitle = hymn.titleEnglish || hymn.titleHiligaynon;
  return {
    title: `${displayTitle} | SBC Church App`,
  };
}

// This Server Component fetches data (or attempts to) and passes it and params to the Client Component
export default async function HymnPageServerWrapper({ params }: { params: { id: string } }) {
  const hymnFromServer = await getHymn(params.id); // Fetches from initialSampleHymns

  // DO NOT call notFound() here.
  // Pass hymnFromServer (which can be undefined) and params to the client component.
  // The client component will handle loading from localStorage and displaying "not found" if necessary.
  return <HymnInteractiveView hymnFromServer={hymnFromServer} params={params} />;
}
