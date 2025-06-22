import AppHeader from '@/components/layout/AppHeader';
import ReadingList from '@/components/readings/ReadingList';
import { sampleReadings } from '@/data/readings';

export default async function ReadingsPage() {
  const readings = sampleReadings;

  return (
    <>
      <AppHeader title="R-Readings" />
      <div className="container mx-auto px-4 pb-8">
        <ReadingList readings={readings} />
      </div>
    </>
  );
}
