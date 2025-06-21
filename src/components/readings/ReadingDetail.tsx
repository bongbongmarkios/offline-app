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
            <div className="space-y-4 text-lg text-foreground leading-relaxed">
              {reading.lyrics.split('\n').map((line, index) => {
                const speakerMatch = line.match(/^(Leader:|People:|All:)\s*/);
                if (speakerMatch) {
                  const speaker = speakerMatch[1];
                  const text = line.substring(speaker.length).trim();
                  
                  if (!text) return null; 

                  if (speaker === 'People:') {
                    return (
                        <p key={index} className="font-bold text-foreground">
                            {text}
                        </p>
                    );
                  }
                  // For Leader and All, render normally
                  return <p key={index}>{text}</p>;

                }
                // For lines that don't have a speaker tag (like empty lines for spacing)
                return <p key={index}>{line}</p>;
              })}
            </div>
        </CardContent>
    </Card>
  );
}
