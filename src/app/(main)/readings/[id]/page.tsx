import AppHeader from '@/components/layout/AppHeader';
import ReadingDetail from '@/components/readings/ReadingDetail';
import { sampleReadings } from '@/data/readings';
import type { Reading } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {notFound} from 'next/navigation';

interface ReadingPageProps {
  params: { id: string };
}

async function getReading(id: string): Promise<Reading | undefined> {
  return sampleReadings.find((r) => r.id === id);
}

export async function generateMetadata({ params }: ReadingPageProps) {
  const reading = await getReading(params.id);
  if (!reading) {
    return { title: 'Reading Not Found' };
  }
  return { title: reading.title };
}

export default async function ReadingPage({ params }: ReadingPageProps) {
  const reading = await getReading(params.id);

  if (!reading) {
    notFound();
  }

  return (
    <>
      <AppHeader 
        title={
          <Button asChild variant="outline" size="sm">
            <Link href="/readings">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Readings
            </Link>
          </Button>
        }
      />
      <div className="container mx-auto px-4 pb-8">
        <ReadingDetail reading={reading} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return sampleReadings.map(reading => ({
    id: reading.id,
  }));
}
