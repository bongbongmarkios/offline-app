
'use client';

import { useState, useEffect } from 'react';
import type { Hymn, AnyTrashedItem, TrashedHymn } from '@/types';
import { initialSampleHymns } from '@/data/hymns'; // No longer using deleteSampleHymnsByIds from here
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';
const LOCAL_STORAGE_TRASH_KEY = 'graceNotesTrash';

export default function DeleteHymnDialogContent({ 
  onOpenChange, 
  onDeleteSuccess 
}: DeleteHymnDialogContentProps) {
  const [selectedHymnIds, setSelectedHymnIds] = useState<string[]>([]);
  const [activeHymnsToDisplay, setActiveHymnsToDisplay] = useState<Hymn[]>([]);
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
        // If no active hymns in localStorage, initialize with initialSampleHymns
        // This scenario implies a fresh start or cleared localStorage for active hymns.
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
      setActiveHymnsToDisplay(sortedHymns);
    } catch (error) {
      console.error("Error loading active hymns for deletion dialog:", error);
      // Fallback to initialSampleHymns if there's an error reading localStorage
      const sortedInitial = [...initialSampleHymns].sort((a, b) => {
        const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
        const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
        if (isNaN(pageNumA) && isNaN(pageNumB)) return 0;
        if (isNaN(pageNumA)) return 1;
        if (isNaN(pageNumB)) return -1;
        return pageNumA - pageNumB;
      });
      setActiveHymnsToDisplay(sortedInitial);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCheckboxChange = (hymnId: string, checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
        setSelectedHymnIds((prevSelected) =>
        checked
            ? [...prevSelected, hymnId]
            : prevSelected.filter((id) => id !== hymnId)
        );
    }
  };

  const handleMoveToTrashSelected = () => {
    if (selectedHymnIds.length === 0) {
      toast({
        title: 'No Hymns Selected',
        description: 'Please select at least one hymn to move to trash.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Get current active hymns
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      let currentActiveHymns: Hymn[] = storedHymnsString ? JSON.parse(storedHymnsString) : [...initialSampleHymns];

      // Get current trash or initialize if empty
      const storedTrashString = localStorage.getItem(LOCAL_STORAGE_TRASH_KEY);
      let currentTrash: AnyTrashedItem[] = storedTrashString ? JSON.parse(storedTrashString) : [];

      const hymnsToTrash: TrashedHymn[] = [];
      const remainingActiveHymns = currentActiveHymns.filter(hymn => {
        if (selectedHymnIds.includes(hymn.id)) {
          hymnsToTrash.push({
            originalId: hymn.id,
            itemType: 'hymn',
            data: hymn,
            trashedAt: new Date().toISOString(),
          });
          return false; // Remove from active list
        }
        return true; // Keep in active list
      });

      // Add selected hymns to trash
      currentTrash.push(...hymnsToTrash);

      // Update localStorage
      localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(remainingActiveHymns));
      localStorage.setItem(LOCAL_STORAGE_TRASH_KEY, JSON.stringify(currentTrash));
      
      // Update the displayed list within the dialog immediately
      const sortedRemainingHymns = [...remainingActiveHymns].sort((a, b) => {
        const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
        const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
        if (isNaN(pageNumA) && isNaN(pageNumB)) return 0;
        if (isNaN(pageNumA)) return 1;
        if (isNaN(pageNumB)) return -1;
        return pageNumA - pageNumB;
      });
      setActiveHymnsToDisplay(sortedRemainingHymns);

      toast({
        title: 'Hymns Moved to Trash',
        description: `${selectedHymnIds.length} hymn(s) have been moved to trash. They will be permanently deleted after 30 days.`,
      });

      setSelectedHymnIds([]); 
      if (onDeleteSuccess) {
        onDeleteSuccess(); 
      }
      // Do not close dialog automatically, user might want to delete more or cancel
      // onOpenChange(false); 
      
    } catch (error) {
      console.error("Error moving hymns to trash:", error);
      toast({
        title: 'Error',
        description: 'Could not move hymns to trash.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 h-[348px]">
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled>
            Close
            </Button>
            <Button variant="destructive" disabled>
            Move to Trash (0)
            </Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <p className="text-sm text-muted-foreground">Select hymns to move to the trash. Items in trash will be permanently deleted after 30 days.</p>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <div className="space-y-3">
          {activeHymnsToDisplay.length > 0 ? (
            activeHymnsToDisplay.map((hymn) => (
              <div key={hymn.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`hymn-delete-${hymn.id}`}
                  checked={selectedHymnIds.includes(hymn.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(hymn.id, checked)}
                  aria-label={`Select ${hymn.titleEnglish || hymn.titleHiligaynon}`}
                />
                <Label
                  htmlFor={`hymn-delete-${hymn.id}`}
                  className="flex-grow cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {hymn.titleEnglish || hymn.titleHiligaynon}
                  {hymn.pageNumber && <span className="text-xs text-muted-foreground ml-2">(#{hymn.pageNumber})</span>}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No active hymns available.</p>
          )}
        </div>
      </ScrollArea>
      <DialogFooter className="pt-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
        <Button
          variant="destructive"
          onClick={handleMoveToTrashSelected}
          disabled={selectedHymnIds.length === 0 || activeHymnsToDisplay.length === 0}
        >
          Move to Trash ({selectedHymnIds.length})
        </Button>
      </DialogFooter>
    </div>
  );
}

interface DeleteHymnDialogContentProps {
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess?: () => void;
}
