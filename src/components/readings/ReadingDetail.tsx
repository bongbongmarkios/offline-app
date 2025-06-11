'use client';
import type { Reading } from '@/types';
import { useEffect } from 'react';
import { useActivity } from '@/hooks/useActivityTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ReadingDetailProps {
  reading: Reading;
}

export default function ReadingDetail({ reading }: ReadingDetailProps) {
  const { addReadingView } = useActivity();

  useEffect(() => {
    addReadingView(reading.title);
  }, [addReadingView, reading.title]);

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">{reading.title}</CardTitle>
            {reading.source && (
                <CardDescription className="text-md text-muted-foreground pt-2">
                Source: {reading.source}
                </CardDescription>
            )}
        </CardHeader>
        <Separator className="my-2"/>
        <CardContent className="pt-4">
            <div className="whitespace-pre-line text-foreground leading-relaxed text-lg">
            {reading.lyrics}
            </div>
        </CardContent>
    </Card>
  );
}
