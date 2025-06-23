import AppHeader from '@/components/layout/AppHeader';
import ReadingList from '@/components/readings/ReadingList';
import { sampleReadings } from '@/data/readings';

export default async function ReadingsPage() {
  const readings = sampleReadings;

  const headerTitle = (
    <h1 className="text-xl font-headline font-normal text-primary sm:text-2xl">
      SBC APP
    </h1>
  );

  return (
    <>
      <AppHeader title={headerTitle} />
      <div className="container mx-auto px-4 pb-8">
        <ReadingList readings={readings} />
      </div>
    </>
  );
}
