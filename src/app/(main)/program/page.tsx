
import AppHeader from '@/components/layout/AppHeader';
import ProgramList from '@/components/program/ProgramList';
import { samplePrograms } from '@/data/programs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link'; // Link might be used if the button navigates

export default async function ProgramListPage() {
  const programs = samplePrograms;

  return (
    <>
      <AppHeader title="Programs" />
      <div className="container mx-auto px-4 pb-8"> {/* Ensure pb-8 or more to avoid overlap with FAB if content is short */}
        <ProgramList programs={programs} />
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 z-50 print:hidden"> {/* bottom-20 to be above the 16h navbar + some padding */}
        <Button
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg"
          aria-label="Add new program"
          // onClick={() => console.log('Add program clicked')} // Placeholder for future action
          // Or link to an add page:
          // asChild
        >
          {/* <Link href="/program/add"> */}
            <Plus className="h-7 w-7" />
          {/* </Link> */}
        </Button>
      </div>
    </>
  );
}
