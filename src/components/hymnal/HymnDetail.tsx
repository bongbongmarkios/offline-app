'use client';
import type { Hymn } from '@/types';
import { useEffect } from 'react';
import { useActivity } from '@/hooks/useActivityTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface HymnDetailProps {
  hymn: Hymn;
}

export default function HymnDetail({ hymn }: HymnDetailProps) {
  const { addHymnView } = useActivity();

  useEffect(() => {
    addHymnView(hymn.title);
  }, [addHymnView, hymn.title]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-3xl text-primary">{hymn.title}</CardTitle>
            {hymn.number && <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">{hymn.number}</span>}
        </div>
        {(hymn.author || hymn.composer) && (
            <CardDescription className="text-md text-muted-foreground pt-2">
            {hymn.author && <span>Author: {hymn.author}</span>}
            {hymn.author && hymn.composer && <span className="mx-2">|</span>}
            {hymn.composer && <span>Composer: {hymn.composer}</span>}
            </CardDescription>
        )}
        {hymn.category && (
             <CardDescription className="text-sm text-muted-foreground italic pt-1">
                Category: {hymn.category}
            </CardDescription>
        )}
      </CardHeader>
      <Separator className="my-2"/>
      <CardContent className="pt-4">
        <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
          {hymn.lyrics}
        </div>
      </CardContent>
    </Card>
  );
}
