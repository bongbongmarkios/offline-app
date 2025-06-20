
'use client';

import type { Program } from '@/types';
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
}

export default function ProgramList({ programs }: ProgramListProps) {
  const { toast } = useToast();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [programToConfirmDelete, setProgramToConfirmDelete] = useState<Program | null>(null);

  const handleDeleteInitiate = (program: Program, event: React.MouseEvent) => {
    event.preventDefault(); // Stop link navigation if button is somehow part of it
    event.stopPropagation(); // Stop event bubbling
    setProgramToConfirmDelete(program);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!programToConfirmDelete) return;

    const result = await deleteProgramAction(programToConfirmDelete.id);
    if (result?.success) {
      toast({
        title: "Program Deleted",
        description: `"${programToConfirmDelete.title}" has been deleted.`,
      });
    } else {
      toast({
        title: "Error",
        description: result?.error || "Could not delete program.",
        variant: "destructive",
      });
    }
    setIsConfirmDeleteDialogOpen(false);
    setProgramToConfirmDelete(null);
    // Revalidation by server action should refresh the list
  };

  if (!programs || programs.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No programs available.</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-md transition-shadow duration-200 group relative">
            {/* Delete Button - Positioned absolutely within the card */}
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-full"
                onClick={(e) => handleDeleteInitiate(program, e)}
                aria-label={`Delete program ${program.title}`}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Link wraps the content area */}
            <Link href={`/program/${program.id}`} className="block hover:no-underline p-0" aria-label={`View program ${program.title}`}>
              <CardHeader className="pr-12 pt-4 pb-4 pl-4"> {/* Add padding-right to CardHeader to avoid text overlap with button */}
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

      {/* Confirmation Dialog */}
      {programToConfirmDelete && (
        <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}> {/* Prevent card click if dialog overlaps */}
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the program titled &quot;{programToConfirmDelete.title}&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
