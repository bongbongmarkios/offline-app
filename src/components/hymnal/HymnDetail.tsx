
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
    // Ensure hymn.titleEnglish exists before calling addHymnView,
    // as it's marked required in types but might be empty from form if not filled.
    if (hymn.titleEnglish) {
      addHymnView(hymn.titleEnglish);
    }
  }, [addHymnView, hymn.titleEnglish]);

  const getDefaultTab = () => {
    if (hymn.lyricsHiligaynon) return "hiligaynon";
    if (hymn.lyricsFilipino) return "filipino";
    if (hymn.lyricsEnglish) return "english";
    return "hiligaynon"; // Default to hiligaynon even if empty, to show the "unavailable" message.
  }
  const defaultTab = getDefaultTab();

  const unavailableMessage = <p className="text-muted-foreground italic">Sorry, unavailable this time.</p>;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
            <div className="flex-grow">
                {hymn.titleHiligaynon && <CardTitle className="font-headline text-3xl text-primary">{hymn.titleHiligaynon} (Hiligaynon)</CardTitle>}
                {hymn.titleFilipino && <p className={`text-lg ${hymn.titleHiligaynon ? 'text-muted-foreground' : 'font-headline text-3xl text-primary'}`}>{hymn.titleFilipino} (Filipino)</p>}
                {hymn.titleEnglish && <p className={`text-lg ${(hymn.titleHiligaynon || hymn.titleFilipino) ? 'text-muted-foreground' : 'font-headline text-3xl text-primary'}`}>{hymn.titleEnglish} (English)</p>}
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
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-4">
            <TabsTrigger value="hiligaynon">Hiligaynon</TabsTrigger>
            <TabsTrigger value="filipino">Filipino</TabsTrigger>
            <TabsTrigger value="english">English</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hiligaynon">
            {hymn.lyricsHiligaynon ? (
              <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                {hymn.lyricsHiligaynon}
              </div>
            ) : (
              unavailableMessage
            )}
          </TabsContent>
          
          <TabsContent value="filipino">
            {hymn.lyricsFilipino ? (
              <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                {hymn.lyricsFilipino}
              </div>
            ) : (
              unavailableMessage
            )}
          </TabsContent>
          
          <TabsContent value="english">
            {hymn.lyricsEnglish ? (
              <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
                {hymn.lyricsEnglish}
              </div>
            ) : (
              unavailableMessage
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
