
'use client';

import type { Hymn } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
          <CardContent className="py-2 px-4">
            <div className="text-xs text-muted-foreground space-x-3">
              {hymn.pageNumber && (
                <span>Page: {hymn.pageNumber}</span>
              )}
              {hymn.externalUrl && (
                <span className="block sm:inline mt-1 sm:mt-0">
                  URL: <a href={hymn.externalUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate max-w-[200px] inline-block align-bottom">{hymn.externalUrl}</a>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
