
'use client';
import * as React from 'react';
import type { Reading, ReadingCategory } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookText, BookHeart, Presentation, FilePenLine } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import EditReadingForm from '@/components/readings/EditReadingForm';
import { updateSampleReading } from '@/data/readings';
import { useToast } from '@/hooks/use-toast';

interface ReadingListProps {
  readings: Reading[]; // from server as initial data
}

const LOCAL_STORAGE_READINGS_KEY = 'graceNotesReadings';

const categoryDetails: Record<ReadingCategory, { title: string; icon: React.ElementType }> = {
  'call-to-worship': { title: 'Calls to Worship', icon: Presentation },
  'responsive-reading': { title: 'Responsive Readings', icon: BookText },
  'offertory-sentence': { title: 'Offertory Sentences', icon: BookHeart },
};
const categoryOrder: ReadingCategory[] = ['responsive-reading', 'call-to-worship', 'offertory-sentence'];

export default function ReadingList({ readings: initialReadings }: ReadingListProps) {
  const [allReadings, setAllReadings] = React.useState<Reading[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let loadedReadings: Reading[] = [];
    try {
      const storedReadingsString = localStorage.getItem(LOCAL_STORAGE_READINGS_KEY);
      if (storedReadingsString) {
        loadedReadings = JSON.parse(storedReadingsString);
      } else {
        loadedReadings = [...initialReadings];
        localStorage.setItem(LOCAL_STORAGE_READINGS_KEY, JSON.stringify(loadedReadings));
      }
    } catch (error) {
      console.error("Error loading readings from localStorage:", error);
      loadedReadings = [...initialReadings];
    }
    setAllReadings(loadedReadings);
    setIsLoading(false);

    // Add a listener to update on storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === LOCAL_STORAGE_READINGS_KEY) {
            const newReadings = e.newValue ? JSON.parse(e.newValue) : [];
            setAllReadings(newReadings);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, [initialReadings]);


  if (isLoading) {
    return <p className="text-muted-foreground text-center py-4">Loading readings...</p>;
  }
  
  if (!allReadings || allReadings.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No readings available.</p>;
  }

  const groupedReadings = allReadings.reduce((acc, reading) => {
    const category = reading.category || 'responsive-reading';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(reading);
    return acc;
  }, {} as Record<ReadingCategory, Reading[]>);

  return (
    <div className="space-y-8">
      {categoryOrder.map((category) => {
        const items = groupedReadings[category];
        if (!items || items.length === 0) return null;

        // Sort items by page number
        items.sort((a, b) => {
          const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
          const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
          if (isNaN(pageNumA) && isNaN(pageNumB)) return a.title.localeCompare(b.title);
          if (isNaN(pageNumA)) return 1;
          if (isNaN(pageNumB)) return -1;
          return pageNumA - pageNumB;
        });

        const { title, icon: Icon } = categoryDetails[category];
        const isInlineCategory = category === 'call-to-worship' || category === 'offertory-sentence';

        return (
          <div key={category}>
            {isInlineCategory ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={category} className="border rounded-lg shadow-sm bg-card">
                  <AccordionTrigger className="px-4 md:px-6 py-2 hover:no-underline">
                    <h2 className="text-xl font-headline font-semibold text-primary flex items-center">
                        <Icon className="mr-3 h-6 w-6" />
                        {title}
                      </h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 md:px-6 pb-6">
                    <div className="space-y-6 pt-2">
                      {items.map((reading, index) => (
                        <React.Fragment key={reading.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div>
                              <div className="flex-grow">
                                <h3 className="font-headline text-lg text-primary/90 font-semibold">{reading.title}</h3>
                                {reading.source && (
                                  <p className="text-xs text-muted-foreground pt-1">
                                    Source: {reading.source}
                                  </p>
                                )}
                              </div>
                            <div className="mt-2 space-y-2 text-md text-foreground leading-relaxed">
                              {reading.lyrics.split('\n').map((line, lineIndex) => {
                                const speakerMatch = line.match(/^(Leader:|People:|All:)\s*/);
                                if (speakerMatch) {
                                  const text = line.substring(speakerMatch[0].length).trim();
                                  if (!text) return null;
                                  return <p key={lineIndex}>{text}</p>;
                                }
                                return <p key={lineIndex}>{line}</p>;
                              })}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <>
                <h2 className="text-xl font-headline font-semibold text-primary mb-4 flex items-center">
                  <Icon className="mr-3 h-6 w-6" />
                  {title}
                </h2>
                <div className="space-y-4">
                  {items.map((reading) => (
                      <Link href={`/readings/${reading.id}`} className="block hover:no-underline" key={reading.id}>
                        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer hover:border-primary/50">
                          <CardHeader>
                              <div className="flex items-start gap-3">
                              {reading.pageNumber && (
                                <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex-shrink-0 mt-1">
                                  {reading.pageNumber}
                                </span>
                              )}
                              <div className="flex-grow">
                                <CardTitle className="font-headline text-xl text-primary">
                                  {reading.title}
                                </CardTitle>
                                {reading.source && (
                                  <CardDescription className="text-sm text-muted-foreground pt-1">
                                    Source: {reading.source}
                                  </CardDescription>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
