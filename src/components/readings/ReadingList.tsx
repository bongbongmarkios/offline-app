
'use client';
import * as React from 'react';
import type { Reading, ReadingCategory } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookText, BookHeart, Presentation } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ReadingListProps {
  readings: Reading[];
}

const categoryDetails: Record<ReadingCategory, { title: string; icon: React.ElementType }> = {
  'call-to-worship': { title: 'Calls to Worship', icon: Presentation },
  'responsive-reading': { title: 'Responsive Readings', icon: BookText },
  'offertory-sentence': { title: 'Offertory Sentences', icon: BookHeart },
};
const categoryOrder: ReadingCategory[] = ['responsive-reading', 'call-to-worship', 'offertory-sentence'];

export default function ReadingList({ readings }: ReadingListProps) {
  if (!readings || readings.length === 0) {
    return <p className="text-muted-foreground">No readings available.</p>;
  }

  const groupedReadings = readings.reduce((acc, reading) => {
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

        const { title, icon: Icon } = categoryDetails[category];
        const isInlineCategory = category === 'call-to-worship' || category === 'offertory-sentence';

        return (
          <div key={category}>
            {isInlineCategory ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={category} className="border rounded-lg shadow-sm bg-card">
                  <AccordionTrigger className="px-4 md:px-6 py-2 hover:no-underline">
                     <h2 className="text-2xl font-headline font-semibold text-primary flex items-center">
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
                            <h3 className="font-headline text-lg text-primary/90 font-semibold">{reading.title}</h3>
                            {reading.source && (
                              <p className="text-xs text-muted-foreground pt-1">
                                Source: {reading.source}
                              </p>
                            )}
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
                <h2 className="text-2xl font-headline font-semibold text-primary mb-4 flex items-center">
                  <Icon className="mr-3 h-6 w-6" />
                  {title}
                </h2>
                <div className="space-y-4">
                  {items.map((reading) => (
                    <Link key={reading.id} href={`/readings/${reading.id}`} className="block hover:no-underline">
                      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer hover:border-primary/50">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="flex-grow">
                              <CardTitle className="font-headline text-xl group-hover:text-primary">{reading.title}</CardTitle>
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
