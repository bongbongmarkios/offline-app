
'use client';

import type { Program, TrashedProgram, AnyTrashedItem } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProgramAction } from '@/app/(main)/program/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ProgramListProps {
  programs: Program[];
  onProgramDeleted?: () => void; // Optional callback to refresh list
}

const LOCAL_STORAGE_TRASH_KEY = 'graceNotesTrash';

export default function ProgramList({ programs, onProgramDeleted }: ProgramListProps) {
  const { toast } = useToast();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [programToConfirmDelete, setProgramToConfirmDelete] = useState<Program | null>(null);

  const handleDeleteInitiate = (program: Program, event: React.MouseEvent) => {
    event.preventDefault(); 
    event.stopPropagation(); 
    setProgramToConfirmDelete(program);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!programToConfirmDelete) return;

    const result = await deleteProgramAction(programToConfirmDelete.id);
    
    if (result?.success && result.deletedProgram) {
      try {
        const storedTrashString = localStorage.getItem(LOCAL_STORAGE_TRASH_KEY);
        let currentTrash: AnyTrashedItem[] = storedTrashString ? JSON.parse(storedTrashString) : [];
        
        const trashedProgramEntry: TrashedProgram = {
          originalId: result.deletedProgram.id,
          itemType: 'program',
          data: result.deletedProgram,
          trashedAt: new Date().toISOString(),
        };
        currentTrash.push(trashedProgramEntry);
        localStorage.setItem(LOCAL_STORAGE_TRASH_KEY, JSON.stringify(currentTrash));

        toast({
          title: "Program Moved to Trash",
          description: `"${result.deletedProgram.title}" has been moved to trash.`,
          duration: 1000, // Make toast disappear quickly
        });
      } catch (e) {
        console.error("Error moving program to localStorage trash:", e);
        toast({
            title: "Program Deleted (Not Trashed)",
            description: `"${result.deletedProgram.title}" was removed, but failed to move to trash.`,
            variant: "destructive"
        });
      }
      if (onProgramDeleted) {
        onProgramDeleted(); // Call parent callback to refresh
      }
    } else {
      toast({
        title: "Error",
        description: result?.error || "Could not delete program.",
        variant: "destructive",
      });
    }
    setIsConfirmDeleteDialogOpen(false);
    setProgramToConfirmDelete(null);
    // Server action revalidation should also trigger a refresh of the program list page
  };

  if (!programs || programs.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No programs available.</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-md transition-shadow duration-200 relative">
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive transition-opacity rounded-full"
                onClick={(e) => handleDeleteInitiate(program, e)}
                aria-label={`Delete program ${program.title}`}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            
            <Link href={`/program/${program.id}`} className="block hover:no-underline p-0" aria-label={`View program ${program.title}`}>
              <CardHeader className="pr-12 pt-4 pb-4 pl-4"> 
                <CardTitle className="font-headline text-xl group-hover:text-primary">{program.title}</CardTitle>
                {program.date && (
                  <CardDescription className="text-sm text-muted-foreground pt-1 flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {new Date(program.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                )}
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>

      {programToConfirmDelete && (
        <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}> 
            <AlertDialogHeader>
              <AlertDialogTitle>Move to Trash?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to move the program &quot;{programToConfirmDelete.title}&quot; to the trash? It can be restored later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Move to Trash
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
