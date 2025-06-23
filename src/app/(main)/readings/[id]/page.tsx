
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader';
import ReadingDetail from '@/components/readings/ReadingDetail';
import { sampleReadings } from '@/data/readings';
import type { Reading } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

const LOCAL_STORAGE_READINGS_KEY = 'graceNotesReadings';

export default function ReadingPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [reading, setReading] = useState<Reading | null | undefined>(undefined); // undefined for loading, null for not found

  useEffect(() => {
    if (!id) return;

    let foundReading: Reading | undefined;
    try {
        const storedReadingsString = localStorage.getItem(LOCAL_STORAGE_READINGS_KEY);
        if (storedReadingsString) {
            const allReadings: Reading[] = JSON.parse(storedReadingsString);
            foundReading = allReadings.find(r => r.id === id);
        }

        // If not found in localStorage, check initial data as a fallback
        if (!foundReading) {
            foundReading = sampleReadings.find(r => r.id === id);
        }

    } catch (error) {
        console.error("Error loading reading from localStorage:", error);
        // Fallback to initial data on error
        foundReading = sampleReadings.find(r => r.id === id);
    }
    
    setReading(foundReading || null); // Set to null if not found anywhere

  }, [id]);

  useEffect(() => {
    if(reading) {
        document.title = `${reading.title} | SBC App`;
    }
  }, [reading]);

  if (reading === undefined) {
    // Loading state
    return (
      <>
        <AppHeader 
          title={
            <Button asChild variant="outline" size="sm" disabled>
              <Link href="/readings">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Readings
              </Link>
            </Button>
          }
        />
        <div className="container mx-auto px-4 pb-8 text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading reading...</p>
        </div>
      </>
    );
  }

  if (reading === null) {
    // Not found state
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
        <div className="container mx-auto px-4 pb-8 text-center py-10">
          <h2 className="text-2xl font-semibold mb-4 text-destructive">Reading Not Found</h2>
          <p className="text-muted-foreground mb-6">The reading with ID "{id}" could not be found.</p>
          <Button asChild>
            <Link href="/readings">Return to Reading List</Link>
          </Button>
        </div>
      </>
    );
  }

  // Reading found, render it
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
