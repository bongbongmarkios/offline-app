
'use client';
import type { Reading } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookText } from 'lucide-react';

interface ReadingListProps {
  readings: Reading[];
}

export default function ReadingList({ readings }: ReadingListProps) {
  if (!readings || readings.length === 0) {
    return <p className="text-muted-foreground">No readings available.</p>;
  }

  return (
    <div className="space-y-4">
      {readings.map((reading) => (
        <Link key={reading.id} href={`/readings/${reading.id}`} className="block hover:no-underline">
          <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                 <BookText className="h-6 w-6 text-primary flex-shrink-0" />
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
  );
}
