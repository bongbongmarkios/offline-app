
'use client';
import type { Program, ProgramItem, Hymn, Reading } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useActivity } from '@/hooks/useActivityTracker';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { initialSampleHymns } from '@/data/hymns'; // For linking hymns
import { sampleReadings } from '@/data/readings'; // For linking readings

interface ProgramPresenterProps {
  program: Program;
}

export default function ProgramPresenter({ program }: ProgramPresenterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addProgramItemView } = useActivity();

  const currentItem = program.items[currentIndex];

  useEffect(() => {
    if (currentItem) {
      addProgramItemView(currentItem.title);
    }
  }, [currentItem, addProgramItemView]);

  const linkedHymn = useMemo(() => {
    if (currentItem?.hymnId) {
      // Use initialSampleHymns instead of sampleHymns
      return initialSampleHymns.find(h => h.id === currentItem.hymnId);
    }
    return null;
  }, [currentItem]);

  const linkedReading = useMemo(() => {
    if (currentItem?.readingId) {
      return sampleReadings.find(r => r.id === currentItem.readingId);
    }
    return null;
  }, [currentItem]);


  const goToNext = () => {
    if (currentIndex < program.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const progressPercentage = ((currentIndex + 1) / program.items.length) * 100;

  if (!program || program.items.length === 0) {
    return <p>This program has no items.</p>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl flex flex-col min-h-[60vh]">
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-headline text-2xl md:text-3xl text-primary">
          {currentItem.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Item {currentIndex + 1} of {program.items.length}
        </p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center p-6">
        {currentItem.content && (
          <p className="text-lg md:text-xl text-foreground mb-4">{currentItem.content}</p>
        )}
        {linkedHymn && (
            <div className="my-4 p-4 border rounded-md bg-secondary/30 w-full">
                <p className="text-sm text-muted-foreground mb-1">Featured Hymn:</p>
                <Link href={`/hymnal/${linkedHymn.id}`} className="text-lg font-semibold text-accent hover:underline">
                    {linkedHymn.titleHiligaynon || linkedHymn.titleEnglish} {linkedHymn.pageNumber ? `(#${linkedHymn.pageNumber})` : ''}
                </Link>
            </div>
        )}
        {linkedReading && (
            <div className="my-4 p-4 border rounded-md bg-secondary/30 w-full">
                <p className="text-sm text-muted-foreground mb-1">Featured Reading:</p>
                <Link href={`/readings/${linkedReading.id}`} className="text-lg font-semibold text-accent hover:underline">
                    {linkedReading.title}
                </Link>
            </div>
        )}
        {!currentItem.content && !linkedHymn && !linkedReading && (
          <p className="text-muted-foreground italic text-lg">Details for this item will be provided during the service.</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-4 border-t">
        <Progress value={progressPercentage} className="w-full h-2" />
        <div className="flex justify-between w-full">
          <Button onClick={goToPrevious} disabled={currentIndex === 0} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentIndex === program.items.length - 1 ? (
             <Button variant="default" disabled>
                End of Program <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={goToNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
