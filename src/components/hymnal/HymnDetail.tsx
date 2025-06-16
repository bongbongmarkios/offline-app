
'use client';
import type { Hymn } from '@/types';
import { useEffect } from 'react';
import { useActivity } from '@/hooks/useActivityTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface HymnDetailProps {
  hymn: Hymn;
}

export default function HymnDetail({ hymn }: HymnDetailProps) {
  const { addHymnView } = useActivity();

  useEffect(() => {
    // Use English title for activity tracking for consistency
    addHymnView(hymn.titleEnglish);
  }, [addHymnView, hymn.titleEnglish]);

  const hasMultipleLyrics = hymn.lyricsFilipino || hymn.lyricsHiligaynon;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
            <div className="flex-grow">
                <CardTitle className="font-headline text-3xl text-primary">{hymn.titleEnglish}</CardTitle>
                {hymn.titleFilipino && <p className="text-lg text-muted-foreground">{hymn.titleFilipino} (Filipino)</p>}
                {hymn.titleHiligaynon && <p className="text-lg text-muted-foreground">{hymn.titleHiligaynon} (Hiligaynon)</p>}
            </div>
            {hymn.pageNumber && <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full ml-4">{hymn.pageNumber}</span>}
        </div>
        
        <div className="text-md text-muted-foreground space-y-1">
            {hymn.keySignature && <p>Key: {hymn.keySignature}</p>}
            {hymn.author && <p>Author: {hymn.author}</p>}
            {hymn.composer && <p>Composer: {hymn.composer}</p>}
            {hymn.category && <p className="italic">Category: {hymn.category}</p>}
        </div>
      </CardHeader>
      <Separator className="my-2"/>
      <CardContent className="pt-4">
        {hasMultipleLyrics ? (
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-4">
              <TabsTrigger value="english" disabled={!hymn.lyricsEnglish}>English</TabsTrigger>
              {hymn.lyricsFilipino && <TabsTrigger value="filipino">Filipino</TabsTrigger>}
              {hymn.lyricsHiligaynon && <TabsTrigger value="hiligaynon">Hiligaynon</TabsTrigger>}
            </TabsList>
            <TabsContent value="english">
              <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                {hymn.lyricsEnglish}
              </div>
            </TabsContent>
            {hymn.lyricsFilipino && (
              <TabsContent value="filipino">
                <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                  {hymn.lyricsFilipino}
                </div>
              </TabsContent>
            )}
            {hymn.lyricsHiligaynon && (
              <TabsContent value="hiligaynon">
                <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                  {hymn.lyricsHiligaynon}
                </div>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
            {hymn.lyricsEnglish} 
          </div>
        )}
      </CardContent>
    </Card>
  );
}
