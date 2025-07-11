
'use client';
import type { Reading } from '@/types';
import { useEffect } from 'react';
import { useActivity } from '@/hooks/useActivityTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ReadingDetailProps {
  reading: Reading;
  fontSizeClass: string;
}

export default function ReadingDetail({ reading, fontSizeClass }: ReadingDetailProps) {
  const { addReadingView } = useActivity();

  useEffect(() => {
    addReadingView(reading.title);
  }, [addReadingView, reading.title, reading.id]);

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">{reading.title}</CardTitle>
            {(reading.source || reading.pageNumber) && (
                <CardDescription className="text-md text-muted-foreground pt-2">
                    {reading.source && `Source: ${reading.source}`}
                    {reading.source && reading.pageNumber && ` | `}
                    {reading.pageNumber && `Page: ${reading.pageNumber}`}
                </CardDescription>
            )}
        </CardHeader>
        <Separator className="my-2"/>
        <CardContent className="pt-4">
            <div className={cn("space-y-4 text-foreground leading-relaxed", fontSizeClass)}>
              {reading.lyrics.split('\n').map((line, index) => {
                const speakerMatch = line.match(/^(Leader:|People:|All:)\s*/);
                if (speakerMatch) {
                  const speaker = speakerMatch[1];
                  const text = line.substring(speaker.length).trim();
                  
                  if (!text) return null; 

                  // Only make "People" lines bold for the 'responsive-reading' category.
                  if (speaker === 'People:' && reading.category === 'responsive-reading') {
                    return (
                        <p key={index} className="font-bold text-foreground">
                            {text}
                        </p>
                    );
                  }
                  // For Leader, All, and People in other categories, render normally.
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
