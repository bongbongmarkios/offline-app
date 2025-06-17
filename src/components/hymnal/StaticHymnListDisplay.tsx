
'use client';

import type { Hymn } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink, Link2 } from 'lucide-react';

interface StaticHymnListDisplayProps {
  hymns: Hymn[];
}

export default function StaticHymnListDisplay({ hymns }: StaticHymnListDisplayProps) {
  if (!hymns || hymns.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No hymns to display.</p>;
  }

  return (
    <div className="space-y-3">
      {hymns.map((hymn) => (
        <Card key={hymn.id} className="bg-card/80 shadow">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-lg font-medium text-primary/90">
              {hymn.titleHiligaynon ? hymn.titleHiligaynon.toUpperCase() : 'Untitled Hymn'}
            </CardTitle>
            {hymn.titleEnglish && hymn.titleEnglish !== hymn.titleHiligaynon && (
              <CardDescription className="text-sm text-muted-foreground">
                {hymn.titleEnglish}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="py-3 px-4 space-y-3">
            <div className="text-xs text-muted-foreground">
              {hymn.pageNumber && (
                <span>Page: {hymn.pageNumber}</span>
              )}
            </div>
            <div className="space-y-2">
              {hymn.externalUrl ? (
                <div className="flex items-center justify-between gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0"/>
                  <a 
                    href={hymn.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-accent hover:underline truncate flex-grow min-w-0"
                    title={hymn.externalUrl}
                  >
                    {hymn.externalUrl}
                  </a>
                  <Button asChild variant="outline" size="sm" className="flex-shrink-0">
                    <Link href={`/hymn-url-editor?hymnId=${hymn.id}`}>
                      Edit URL
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground italic flex-grow">No URL assigned.</p>
                  <Button asChild variant="outline" size="sm" className="flex-shrink-0">
                    <Link href={`/hymn-url-editor?hymnId=${hymn.id}`}>
                       Add URL
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
