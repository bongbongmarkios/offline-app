'use client';

import AppHeader from '@/components/layout/AppHeader';
import ProgramList from '@/components/program/ProgramList';
import { samplePrograms as initialSamplePrograms } from '@/data/programs'; // Renamed for clarity
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddProgramForm from '@/components/program/AddProgramForm';
import { useState, useEffect, useCallback } from 'react';
import type { Program } from '@/types';

const LOCAL_STORAGE_PROGRAMS_KEY = 'graceNotesPrograms';

export default function ProgramListPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false);

  const fetchPrograms = useCallback(() => {
    setIsLoading(true);
    let loadedPrograms: Program[] = [];
    try {
      const storedProgramsString = localStorage.getItem(LOCAL_STORAGE_PROGRAMS_KEY);
      if (storedProgramsString) {
        loadedPrograms = JSON.parse(storedProgramsString);
      } else {
        // Prime localStorage with initial programs if it's empty
        loadedPrograms = [...initialSamplePrograms];
        localStorage.setItem(LOCAL_STORAGE_PROGRAMS_KEY, JSON.stringify(loadedPrograms));
      }
    } catch (error) {
      console.error("Error loading programs from localStorage:", error);
      // Fallback to initialSamplePrograms on error
      loadedPrograms = [...initialSamplePrograms];
    }

    const sortedPrograms = [...loadedPrograms].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA; // Sort descending by date (most recent first)
    });
    setPrograms(sortedPrograms);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleProgramDataChanged = () => {
    fetchPrograms(); 
  };

  const handleProgramAddedSuccess = () => {
    // This now only refreshes the data in the background.
    // The form itself controls when the dialog closes.
    handleProgramDataChanged();
  };

  const closeAddProgramDialog = () => {
    setIsAddProgramDialogOpen(false);
  };


  if (isLoading) {
    return (
      <>
        <AppHeader title="Programs" />
        <div className="container mx-auto px-4 pb-8 text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading programs...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Programs" />
      <div className="container mx-auto px-4 pb-8">
        <ProgramList programs={programs} onProgramDeleted={handleProgramDataChanged} />
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
        <DialogContent className="sm:max-w-xl h-[80vh] sm:h-[75vh] flex flex-col"> {/* Increased width and height */}
          <DialogHeader>
            <DialogTitle>Add New Program</DialogTitle>
            <DialogDescription>
              Enter details and select items for the new program.
            </DialogDescription>
          </DialogHeader>
          <AddProgramForm
            onFormSubmitSuccess={handleProgramAddedSuccess}
            onCancel={closeAddProgramDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
