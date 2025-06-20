
'use client';

import AppHeader from '@/components/layout/AppHeader';
import ProgramList from '@/components/program/ProgramList';
import { samplePrograms } from '@/data/programs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddProgramForm from '@/components/program/AddProgramForm';
import { useState, useEffect } from 'react';
import type { Program } from '@/types';

export default function ProgramListPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false);

  // Function to fetch and sort programs
  const fetchPrograms = () => {
    // Directly use samplePrograms for this example.
    // In a real app, this might involve fetching from an API or localStorage.
    const sortedPrograms = [...samplePrograms].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA; // Sort descending by date (most recent first)
    });
    setPrograms(sortedPrograms);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleProgramAdded = () => {
    setIsAddProgramDialogOpen(false);
    fetchPrograms(); // Re-fetch programs to include the new one
    // Server action revalidation should also trigger an update,
    // but client-side refresh ensures UI consistency immediately.
  };

  if (isLoading) {
    return (
      <>
        <AppHeader title="Programs" />
        <div className="container mx-auto px-4 pb-8 text-center py-10">
          <p className="text-muted-foreground">Loading programs...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Programs" />
      <div className="container mx-auto px-4 pb-8">
        <ProgramList programs={programs} />
      </div>

      <Dialog open={isAddProgramDialogOpen} onOpenChange={setIsAddProgramDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-20 right-6 z-50 print:hidden rounded-full h-14 w-14 shadow-lg"
            aria-label="Add new program"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Program</DialogTitle>
            <DialogDescription>
              Enter the details for the new program.
            </DialogDescription>
          </DialogHeader>
          <AddProgramForm
            onFormSubmitSuccess={handleProgramAdded}
            onCancel={() => setIsAddProgramDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
