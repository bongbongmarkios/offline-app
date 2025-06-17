
'use client'; // Convert to Client Component

import { useMemo, useState, use } from 'react'; // Added use and useState
import type { Hymn } from '@/types';
import { sampleHymns } from '@/data/hymns';
import AppHeader from '@/components/layout/AppHeader';
import HymnDetail from '@/components/hymnal/HymnDetail';
import HymnMultiLanguageDialog from '@/components/hymnal/HymnMultiLanguageDialog'; // Will be simplified
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound, type ReadonlyURLSearchParams } from 'next/navigation';


// Define LanguageOption type here or import if it's moved to types/index.ts
type LanguageOption = 'hiligaynon' | 'filipino' | 'english';

interface HymnPageProps {
  params: { id: string };
  searchParams: ReadonlyURLSearchParams; // Next.js 13+ passes searchParams this way
}


export default function HymnPage({ params: resolvedParams }: HymnPageProps) {
  // Use React.use to resolve the params promise
  // const resolvedParams = use(paramsPromise); // paramsPromise would be the original params prop

  const hymn = useMemo(() => sampleHymns.find((h) => h.id === resolvedParams.id), [resolvedParams.id]);

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>('hiligaynon');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  if (!hymn) {
    notFound();
  }

  const toggleLanguageSelector = () => {
    setShowLanguageSelector(prev => !prev);
  };

  const handleSelectLanguage = (language: LanguageOption) => {
    setSelectedLanguage(language);
    // Optionally, close the selector after a language is chosen, or keep it open
    // setShowLanguageSelector(false); 
  };
  
  // This function would typically be used for metadata in Server Components
  // For client components, title can be set using document.title in useEffect if needed
  // Or, if a parent layout is a server component, it can still use generateMetadata
  // For now, we'll assume title is handled or not a primary concern for this client conversion

  const headerActions = hymn.pageNumber ? (
    <HymnMultiLanguageDialog hymn={hymn} onToggle={toggleLanguageSelector} />
  ) : null;

  return (
    <>
      <AppHeader 
        title={
          <Button asChild variant="outline" size="sm">
            <Link href="/hymnal">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hymnal
            </Link>
          </Button>
        } 
        actions={headerActions}
        hideDefaultActions={true} 
      />
      <div className="container mx-auto px-4 pb-8">
        <HymnDetail 
          hymn={hymn} 
          selectedLanguage={selectedLanguage}
          showLanguageSelector={showLanguageSelector}
          onSelectLanguage={handleSelectLanguage}
        />
      </div>
    </>
  );
}

// generateStaticParams can remain if you pre-render these pages
export async function generateStaticParams() {
  return sampleHymns.map(hymn => ({
    id: hymn.id,
  }));
}
