
'use client';
import type { Hymn } from '@/types';
import { useEffect } from 'react';
import { useActivity } from '@/hooks/useActivityTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface HymnDetailProps {
  hymn: Hymn;
}

export default function HymnDetail({ hymn }: HymnDetailProps) {
  const { addHymnView } = useActivity();

  useEffect(() => {
    if (hymn.titleEnglish) { 
      addHymnView(hymn.titleEnglish);
    }
  }, [addHymnView, hymn.titleEnglish, hymn.id]); 

  const hasHiligaynonLyrics = hymn.lyricsHiligaynon;

  return (
    <Card className="shadow-lg">
      <CardHeader className="relative">
        <div className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">
            {hymn.titleHiligaynon.toUpperCase()}
          </CardTitle>
          {hymn.titleFilipino && hymn.titleFilipino.toUpperCase() !== hymn.titleHiligaynon.toUpperCase() && (
            <p className="text-lg text-muted-foreground">{hymn.titleFilipino.toUpperCase()}</p>
          )}
          {hymn.titleEnglish && hymn.titleEnglish.toUpperCase() !== hymn.titleHiligaynon.toUpperCase() && (
            <p className="text-lg text-muted-foreground">{hymn.titleEnglish}</p>
          )}
        </div>
        
        <div className="mt-3 text-md text-muted-foreground space-y-1 text-center">
            {hymn.keySignature && <p>Key: {hymn.keySignature}</p>}
            {hymn.composer && <p>Composer: {hymn.composer}</p>}
            {hymn.pageNumber && <p>Page: {hymn.pageNumber}</p>}
        </div>
      </CardHeader>
      <Separator className="my-2"/>
      <CardContent className="pt-4 space-y-6">
        {!hasHiligaynonLyrics ? (
           <p className="text-muted-foreground italic text-center py-4">Sorry, Hiligaynon lyrics unavailable for this hymn.</p>
        ) : (
          <div>
            <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
              {hymn.lyricsHiligaynon}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
