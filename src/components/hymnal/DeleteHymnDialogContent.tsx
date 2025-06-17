
'use client';

import { useState, useEffect } from 'react';
import type { Hymn } from '@/types';
import { initialSampleHymns, deleteSampleHymnsByIds } from '@/data/hymns';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

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
  const [hymnsToDisplay, setHymnsToDisplay] = useState<Hymn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      let loadedHymns: Hymn[];
      if (storedHymnsString) {
        loadedHymns = JSON.parse(storedHymnsString);
      } else {
        // Fallback to initialSampleHymns if localStorage is empty
        // And prime localStorage with the initial set if it was empty
        loadedHymns = [...initialSampleHymns];
        localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(loadedHymns));
      }
      
      const sortedHymns = [...loadedHymns].sort((a, b) => {
          const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
          const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
          if (isNaN(pageNumA) && isNaN(pageNumB)) return 0;
          if (isNaN(pageNumA)) return 1;
          if (isNaN(pageNumB)) return -1;
          return pageNumA - pageNumB;
      });
      setHymnsToDisplay(sortedHymns);
    } catch (error) {
      console.error("Error loading hymns from localStorage for deletion dialog:", error);
      // Fallback to initialSampleHymns on error (already sorted on server, but sort again for safety)
      const sortedInitial = [...initialSampleHymns].sort((a, b) => {
        const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
        const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
        if (isNaN(pageNumA) && isNaN(pageNumB)) return 0;
        if (isNaN(pageNumA)) return 1;
        if (isNaN(pageNumB)) return -1;
        return pageNumA - pageNumB;
      });
      setHymnsToDisplay(sortedInitial);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array: runs once when the dialog is opened (component mounts)

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
      let currentStoredHymns: Hymn[] = [];
      if (storedHymnsString) {
        currentStoredHymns = JSON.parse(storedHymnsString);
      } else {
        // If localStorage was empty, base it on (now modified) initialSampleHymns
        currentStoredHymns = [...initialSampleHymns];
      }
      
      const updatedStoredHymns = currentStoredHymns.filter(h => !selectedHymnIds.includes(h.id));
      localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(updatedStoredHymns));
      
      // Update the displayed list within the dialog immediately
      setHymnsToDisplay(updatedStoredHymns.sort((a, b) => {
        const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
        const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
        if (isNaN(pageNumA) && isNaN(pageNumB)) return 0;
        if (isNaN(pageNumA)) return 1;
        if (isNaN(pageNumB)) return -1;
        return pageNumA - pageNumB;
      }));

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
      description: `${selectedHymnIds.length} hymn(s) have been deleted. The main list will refresh.`,
    });

    setSelectedHymnIds([]); // Clear selection
    if (onDeleteSuccess) {
      onDeleteSuccess(); 
    } else {
      // This part might not be strictly necessary if onDeleteSuccess always closes the dialog
      onOpenChange(false); 
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 h-[348px]"> {/* Min height to match ScrollArea + Footer */}
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled>
            Cancel
            </Button>
            <Button variant="destructive" disabled>
            Delete Selected (0)
            </Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <div className="space-y-3">
          {hymnsToDisplay.length > 0 ? (
            hymnsToDisplay.map((hymn) => (
              <div key={hymn.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`hymn-delete-${hymn.id}`} // Ensure unique ID for checkbox
                  checked={selectedHymnIds.includes(hymn.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(hymn.id, checked)}
                  aria-label={`Select ${hymn.titleEnglish || hymn.titleHiligaynon}`}
                />
                <Label
                  htmlFor={`hymn-delete-${hymn.id}`} // Match unique ID
                  className="flex-grow cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {hymn.titleEnglish || hymn.titleHiligaynon}
                  {hymn.pageNumber && <span className="text-xs text-muted-foreground ml-2">(#{hymn.pageNumber})</span>}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No hymns available to delete.</p>
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
          disabled={selectedHymnIds.length === 0 || hymnsToDisplay.length === 0}
        >
          Delete Selected ({selectedHymnIds.length})
        </Button>
      </DialogFooter>
    </div>
  );
}
