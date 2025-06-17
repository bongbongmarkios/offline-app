
'use client';
import type { Hymn } from '@/types';
import { useEffect } from 'react';
import { useActivity } from '@/hooks/useActivityTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Globe } from 'lucide-react'; // Imported Globe icon

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
      <CardHeader className="relative"> {/* Added relative for absolute positioning of the Globe icon */}
        <div className="relative mb-2"> {/* Container for titles */}
            <div className="text-center"> {/* Centers the titles */}
                {hymn.titleHiligaynon && <CardTitle className="font-headline text-3xl text-primary">{hymn.titleHiligaynon}</CardTitle>}
                {hymn.titleFilipino && <p className={`text-lg ${hymn.titleHiligaynon ? 'text-muted-foreground' : 'font-headline text-3xl text-primary'}`}>{hymn.titleFilipino}</p>}
                {hymn.titleEnglish && <p className={`text-lg ${(hymn.titleHiligaynon || hymn.titleFilipino) ? 'text-muted-foreground' : 'font-headline text-3xl text-primary'}`}>{hymn.titleEnglish}</p>}
            </div>
        </div>
        
        <div className="text-md text-muted-foreground space-y-1 text-center">
            {hymn.keySignature && <p>Key: {hymn.keySignature}</p>}
            {hymn.composer && <p>Composer: {hymn.composer}</p>}
            {hymn.pageNumber && <p>Page: {hymn.pageNumber}</p>}
        </div>

        {/* Globe icon, positioned absolutely to the bottom-right of the CardHeader */}
        {/* It will only appear if hymn.pageNumber exists */}
        {hymn.pageNumber && (
          <Globe className="absolute right-6 bottom-6 h-6 w-6 text-muted-foreground" />
        )}
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
