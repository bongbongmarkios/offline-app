
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
    addHymnView(hymn.titleEnglish);
  }, [addHymnView, hymn.titleEnglish]);

  const defaultTab = hymn.lyricsHiligaynon
    ? "hiligaynon"
    : hymn.lyricsFilipino
    ? "filipino"
    : "english";

  const hasAnyLyrics = hymn.lyricsEnglish || hymn.lyricsFilipino || hymn.lyricsHiligaynon;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
            <div className="flex-grow">
                {hymn.titleHiligaynon && <CardTitle className="font-headline text-3xl text-primary">{hymn.titleHiligaynon} (Hiligaynon)</CardTitle>}
                {hymn.titleFilipino && <p className={`text-lg ${hymn.titleHiligaynon ? 'text-muted-foreground' : 'font-headline text-3xl text-primary'}`}>{hymn.titleFilipino} (Filipino)</p>}
                <p className={`text-lg ${hymn.titleHiligaynon || hymn.titleFilipino ? 'text-muted-foreground' : 'font-headline text-3xl text-primary'}`}>{hymn.titleEnglish} (English)</p>
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
        {hasAnyLyrics ? (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-4">
              {hymn.lyricsHiligaynon && <TabsTrigger value="hiligaynon">Hiligaynon</TabsTrigger>}
              {hymn.lyricsFilipino && <TabsTrigger value="filipino">Filipino</TabsTrigger>}
              {hymn.lyricsEnglish && <TabsTrigger value="english">English</TabsTrigger>}
            </TabsList>
            {hymn.lyricsHiligaynon && (
              <TabsContent value="hiligaynon">
                <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                  {hymn.lyricsHiligaynon}
                </div>
              </TabsContent>
            )}
            {hymn.lyricsFilipino && (
              <TabsContent value="filipino">
                <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                  {hymn.lyricsFilipino}
                </div>
              </TabsContent>
            )}
             {hymn.lyricsEnglish && (
              <TabsContent value="english">
                <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                  {hymn.lyricsEnglish}
                </div>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <p className="text-muted-foreground">No lyrics available for this hymn.</p>
        )}
      </CardContent>
    </Card>
  );
}
