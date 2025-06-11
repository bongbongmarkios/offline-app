
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
              <div className="flex items-center justify-between">
                <CardTitle className="font-headline text-xl group-hover:text-primary">{hymn.title}</CardTitle>
                {hymn.number && <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{hymn.number}</span>}
              </div>
              {hymn.author && (
                <CardDescription className="text-sm text-muted-foreground pt-1">
                  Author: {hymn.author}
                </CardDescription>
              )}
               {hymn.category && (
                <CardDescription className="text-xs text-muted-foreground italic pt-1">
                  Category: {hymn.category}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
