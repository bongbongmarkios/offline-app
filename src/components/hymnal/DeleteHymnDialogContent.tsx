
'use client';

import { useState } from 'react';
import type { Hymn } from '@/types';
import { initialSampleHymns } from '@/data/hymns'; // Changed from sampleHymns
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog'; // For consistent footer styling

interface DeleteHymnDialogContentProps {
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess?: () => void;
}

export default function DeleteHymnDialogContent({ 
  onOpenChange, 
  onDeleteSuccess 
}: DeleteHymnDialogContentProps) {
  const [selectedHymnIds, setSelectedHymnIds] = useState<string[]>([]);
  const { toast } = useToast();

  // In a real app, hymns might be passed as props or fetched.
  // For now, it uses the initial set. Ideally, this would also interact with localStorage.
  const hymns: Hymn[] = initialSampleHymns; // Changed from sampleHymns

  const handleCheckboxChange = (hymnId: string, checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
        setSelectedHymnIds((prevSelected) =>
        checked
            ? [...prevSelected, hymnId]
            : prevSelected.filter((id) => id !== hymnId)
        );
    }
  };

  const handleDeleteSelected = () => {
    if (selectedHymnIds.length === 0) {
      toast({
        title: 'No Hymns Selected',
        description: 'Please select at least one hymn to delete.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate deletion for now.
    // TODO: Integrate with localStorage for persistent deletion.
    console.log('Deleting hymns with IDs:', selectedHymnIds);
    // Example of what localStorage deletion might look like (to be implemented fully later):
    // try {
    //   const storedHymnsString = localStorage.getItem('graceNotesHymns');
    //   if (storedHymnsString) {
    //     let storedHymns: Hymn[] = JSON.parse(storedHymnsString);
    //     storedHymns = storedHymns.filter(h => !selectedHymnIds.includes(h.id));
    //     localStorage.setItem('graceNotesHymns', JSON.stringify(storedHymns));
    //   }
      // Also update the in-memory initialSampleHymns for server-side consistency (if needed)
      // This part is tricky as initialSampleHymns is not directly mutable from client components in a clean way
      // without more complex state management or server actions.
    // } catch (error) {
    //   console.error("Error deleting hymns from localStorage:", error);
    // }


    toast({
      title: 'Hymns Deleted (Simulated)',
      description: `${selectedHymnIds.length} hymn(s) have been "deleted". This is not yet persistent.`,
    });

    setSelectedHymnIds([]); // Clear selection
    if (onDeleteSuccess) {
      onDeleteSuccess(); // This could trigger closing the dialog or other actions
    } else {
      onOpenChange(false); // Default to closing the dialog
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <div className="space-y-3">
          {hymns.length > 0 ? (
            hymns.map((hymn) => (
              <div key={hymn.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`hymn-${hymn.id}`}
                  checked={selectedHymnIds.includes(hymn.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(hymn.id, checked)}
                  aria-label={`Select ${hymn.titleEnglish}`}
                />
                <Label
                  htmlFor={`hymn-${hymn.id}`}
                  className="flex-grow cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {hymn.titleEnglish}
                  {hymn.pageNumber && <span className="text-xs text-muted-foreground ml-2">(#{hymn.pageNumber})</span>}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center">No hymns available to delete.</p>
          )}
        </div>
      </ScrollArea>
      <DialogFooter className="pt-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteSelected}
          disabled={selectedHymnIds.length === 0}
        >
          Delete Selected ({selectedHymnIds.length})
        </Button>
      </DialogFooter>
    </div>
  );
}
