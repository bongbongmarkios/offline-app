'use client';
import type { Reading, ReadingCategory } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookText, BookHeart, Presentation } from 'lucide-react';

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
            <h2 className="text-2xl font-headline font-semibold text-primary mb-4 flex items-center">
              <Icon className="mr-3 h-6 w-6" />
              {title}
            </h2>
            <div className="space-y-4">
              {items.map((reading) => {
                if (isInlineCategory) {
                  // Render the full content directly on this page for certain categories
                  return (
                    <Card key={reading.id} className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="font-headline text-lg text-primary/90">{reading.title}</CardTitle>
                        {reading.source && (
                          <CardDescription className="text-xs text-muted-foreground pt-1">
                            Source: {reading.source}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-md text-foreground leading-relaxed">
                          {reading.lyrics.split('\n').map((line, index) => {
                            const speakerMatch = line.match(/^(Leader:|People:|All:)\s*/);
                            if (speakerMatch) {
                              const text = line.substring(speakerMatch[0].length).trim();
                              // Don't render empty lines that might result from stripping the speaker tag
                              if (!text) return null;
                              return <p key={index}>{text}</p>;
                            }
                            return <p key={index}>{line}</p>;
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                } else {
                  // Original behavior for responsive readings (they are longer and benefit from a detail page)
                  return (
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
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
