
'use client';
import type { Hymn } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card'; // Removed CardDescription as it's not used in the new layout
import { Music2 } from 'lucide-react'; // This icon seems unused in the current rendering, consider removing if not needed.

interface HymnListProps {
  hymns: Hymn[];
}

export default function HymnList({ hymns }: HymnListProps) {
  if (!hymns || hymns.length === 0) {
    return <p className="text-muted-foreground">No hymns available.</p>;
  }

  return (
    <div className="space-y-4">
      {hymns.map((hymn) => (
        <Link key={hymn.id} href={`/hymnal/${hymn.id}`} className="block hover:no-underline">
          <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer hover:border-primary/50">
            <CardHeader>
              <div className="flex items-start gap-3">
                {hymn.pageNumber && (
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex-shrink-0 mt-1">
                    {hymn.pageNumber}
                  </span>
                )}
                <div className="flex-grow">
                  <CardTitle className="font-headline text-xl group-hover:text-primary">
                    {hymn.titleHiligaynon.toUpperCase()}
                  </CardTitle>
                  {hymn.titleEnglish && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {hymn.titleEnglish}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
