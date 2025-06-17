
'use client';

import { useState } from 'react';
import type { Hymn } from '@/types';
import { initialSampleHymns, deleteSampleHymnsByIds } from '@/data/hymns'; // Changed from sampleHymns, added delete function
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog'; // For consistent footer styling

const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

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
  const hymnsToDisplay: Hymn[] = [...initialSampleHymns]; // Use a copy for display

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

    // Update the in-memory initialSampleHymns array
    deleteSampleHymnsByIds(selectedHymnIds);

    // Update localStorage
    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      if (storedHymnsString) {
        let storedHymns: Hymn[] = JSON.parse(storedHymnsString);
        storedHymns = storedHymns.filter(h => !selectedHymnIds.includes(h.id));
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(storedHymns));
      } else {
        // If localStorage was empty, it's fine, initialSampleHymns is already updated.
        // We could prime localStorage with the (now modified) initialSampleHymns,
        // but HymnList will do this on next load if it finds localStorage empty.
        // For consistency after deletion, let's also ensure it's updated or empty.
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(initialSampleHymns));
      }
    } catch (error) {
      console.error("Error deleting hymns from localStorage:", error);
      toast({
        title: 'Error',
        description: 'Could not update hymns in local storage.',
        variant: 'destructive',
      });
      // Proceed with UI update even if localStorage fails for this operation
    }

    toast({
      title: 'Hymns Deleted',
      description: `${selectedHymnIds.length} hymn(s) have been deleted. The list will refresh.`,
    });

    setSelectedHymnIds([]); // Clear selection
    if (onDeleteSuccess) {
      onDeleteSuccess(); 
    } else {
      onOpenChange(false); 
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <div className="space-y-3">
          {hymnsToDisplay.length > 0 ? ( // Use hymnsToDisplay
            hymnsToDisplay.map((hymn) => ( // Use hymnsToDisplay
              <div key={hymn.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`hymn-${hymn.id}`}
                  checked={selectedHymnIds.includes(hymn.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(hymn.id, checked)}
                  aria-label={`Select ${hymn.titleEnglish || hymn.titleHiligaynon}`}
                />
                <Label
                  htmlFor={`hymn-${hymn.id}`}
                  className="flex-grow cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {hymn.titleEnglish || hymn.titleHiligaynon}
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
