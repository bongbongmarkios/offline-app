
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
  }, [addHymnView, hymn.titleEnglish]);

  const hasAnyLyrics = hymn.lyricsHiligaynon || hymn.lyricsFilipino || hymn.lyricsEnglish;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
            <div className="flex-grow text-center">
                {hymn.titleHiligaynon && <CardTitle className="font-headline text-3xl text-primary">{hymn.titleHiligaynon}</CardTitle>}
                {hymn.titleFilipino && <p className={`text-lg ${hymn.titleHiligaynon ? 'text-muted-foreground' : 'font-headline text-3xl text-primary'}`}>{hymn.titleFilipino}</p>}
                {hymn.titleEnglish && <p className={`text-lg ${(hymn.titleHiligaynon || hymn.titleFilipino) ? 'text-muted-foreground' : 'font-headline text-3xl text-primary'}`}>{hymn.titleEnglish}</p>}
            </div>
            {hymn.pageNumber && <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full ml-4 flex-shrink-0">{hymn.pageNumber}</span>}
        </div>
        
        <div className="text-md text-muted-foreground space-y-1 text-center">
            {hymn.keySignature && <p>Key: {hymn.keySignature}</p>}
            {hymn.composer && <p>Composer: {hymn.composer}</p>}
        </div>
      </CardHeader>
      <Separator className="my-2"/>
      <CardContent className="pt-4 space-y-6">
        {!hasAnyLyrics ? (
           <p className="text-muted-foreground italic text-center py-4">Sorry, lyrics unavailable this time.</p>
        ) : (
          <>
            {hymn.lyricsHiligaynon && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary/90">Hiligaynon</h3>
                <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                  {hymn.lyricsHiligaynon}
                </div>
              </div>
            )}
            {hymn.lyricsFilipino && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary/90">Filipino</h3>
                <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                  {hymn.lyricsFilipino ? hymn.lyricsFilipino : <p className="text-muted-foreground italic">Sorry, lyrics unavailable this time.</p>}
                </div>
              </div>
            )}
            {hymn.lyricsEnglish && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary/90">English</h3>
                <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                  {hymn.lyricsEnglish ? hymn.lyricsEnglish : <p className="text-muted-foreground italic">Sorry, lyrics unavailable this time.</p>}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
