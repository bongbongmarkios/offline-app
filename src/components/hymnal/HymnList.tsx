
'use client';
import type { Hymn } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Music2 } from 'lucide-react';

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
              <div className="flex items-center gap-3">
                {hymn.pageNumber && (
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex-shrink-0">
                    {hymn.pageNumber}
                  </span>
                )}
                <CardTitle className="font-headline text-xl group-hover:text-primary">{hymn.titleEnglish}</CardTitle>
              </div>
              { (hymn.titleFilipino || hymn.titleHiligaynon) && (
                <CardDescription className="text-xs text-muted-foreground pt-1">
                  {hymn.titleFilipino && <span>Filipino: {hymn.titleFilipino}</span>}
                  {hymn.titleFilipino && hymn.titleHiligaynon && <span className="mx-1">|</span>}
                  {hymn.titleHiligaynon && <span>Hiligaynon: {hymn.titleHiligaynon}</span>}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
