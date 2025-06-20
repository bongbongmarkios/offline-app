
import AppHeader from '@/components/layout/AppHeader';
import ProgramList from '@/components/program/ProgramList';
import { samplePrograms } from '@/data/programs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
// Removed Link import as it's not directly used by the FAB anymore for navigation
import { createNewProgramAction } from './actions'; // Import the server action

export default async function ProgramListPage() {
  // Fetching samplePrograms directly here.
  // Server actions + revalidatePath will handle updates.
  const programs = [...samplePrograms].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA; // Sort descending by date (most recent first)
  });


  return (
    <>
      <AppHeader title="Programs" />
      <div className="container mx-auto px-4 pb-8">
        <ProgramList programs={programs} />
      </div>

      {/* Floating Action Button wrapped in a form to trigger server action */}
      <form action={createNewProgramAction} className="fixed bottom-20 right-6 z-50 print:hidden">
        <Button
          type="submit"
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg" // Default variant applies primary color
          aria-label="Add new program"
        >
          <Plus className="h-7 w-7" />
        </Button>
      </form>
    </>
  );
}
