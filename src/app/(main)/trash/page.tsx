
'use client';

import { useEffect, useState } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArchiveRestore, Trash2, Info, AlertTriangle, RotateCcw, CalendarX2, Layers, Eraser, ArrowLeft } from 'lucide-react';
import type { AnyTrashedItem, TrashedHymn, Hymn } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const LOCAL_STORAGE_TRASH_KEY = 'graceNotesTrash';
const TRASH_EXPIRY_DAYS = 30;

export default function TrashPage() {
  const [trashedItems, setTrashedItems] = useState<AnyTrashedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const loadAndPurgeTrash = () => {
    setIsLoading(true);
    try {
      const storedTrashString = localStorage.getItem(LOCAL_STORAGE_TRASH_KEY);
      let currentTrash: AnyTrashedItem[] = storedTrashString ? JSON.parse(storedTrashString) : [];
      
      const now = new Date().getTime();
      const validTrash = currentTrash.filter(item => {
        const trashedDate = new Date(item.trashedAt).getTime();
        const daysInTrash = (now - trashedDate) / (1000 * 60 * 60 * 24);
        return daysInTrash < TRASH_EXPIRY_DAYS;
      });

      if (validTrash.length < currentTrash.length) {
        localStorage.setItem(LOCAL_STORAGE_TRASH_KEY, JSON.stringify(validTrash));
        const numPurged = currentTrash.length - validTrash.length;
        if (numPurged > 0) {
            toast({
                title: "Trash Purged",
                description: `${numPurged} item(s) older than ${TRASH_EXPIRY_DAYS} days were permanently deleted from trash.`,
                variant: "default"
            });
        }
      }
      setTrashedItems(validTrash.sort((a,b) => new Date(b.trashedAt).getTime() - new Date(a.trashedAt).getTime()));
    } catch (error) {
      console.error("Error loading or purging trash:", error);
      toast({ title: "Error", description: "Could not load trash items.", variant: "destructive" });
      setTrashedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAndPurgeTrash();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestoreItem = (itemToRestore: AnyTrashedItem) => {
    console.log("Attempting to restore:", itemToRestore);

    try {
        if (itemToRestore.itemType === 'hymn') {
            const activeItemsKey = 'graceNotesHymns';
            const activeItemsString = localStorage.getItem(activeItemsKey);
            let activeItems: Hymn[] = activeItemsString ? JSON.parse(activeItemsString) : [];
            
            // Check if item already exists to prevent duplicates, then add
            if (!activeItems.find(h => h.id === (itemToRestore.data as Hymn).id)) {
                 activeItems.push(itemToRestore.data as Hymn);
            }
            localStorage.setItem(activeItemsKey, JSON.stringify(activeItems));
        }
        // Add logic for other item types (readings, programs) here if needed

        const updatedTrash = trashedItems.filter(item => item.originalId !== itemToRestore.originalId || item.itemType !== itemToRestore.itemType);
        localStorage.setItem(LOCAL_STORAGE_TRASH_KEY, JSON.stringify(updatedTrash));
        setTrashedItems(updatedTrash);

        toast({
            title: "Item Restored",
            description: `"${(itemToRestore.data as Hymn).titleEnglish || (itemToRestore.data as Hymn).titleHiligaynon || 'Item'}" has been restored.`,
        });

    } catch (error) {
        console.error("Error restoring item:", error);
        toast({ title: "Error", description: "Could not restore item.", variant: "destructive"});
    }
  };

  const handlePermanentlyDeleteItem = (itemToDelete: AnyTrashedItem) => {
    console.log("Attempting to permanently delete:", itemToDelete);
    try {
        const updatedTrash = trashedItems.filter(item => item.originalId !== itemToDelete.originalId || item.itemType !== itemToDelete.itemType);
        localStorage.setItem(LOCAL_STORAGE_TRASH_KEY, JSON.stringify(updatedTrash));
        setTrashedItems(updatedTrash);
        toast({
            title: "Item Deleted Permanently",
            description: `"${(itemToDelete.data as Hymn).titleEnglish || (itemToDelete.data as Hymn).titleHiligaynon || 'Item'}" has been permanently deleted.`,
        });
    } catch (error) {
        console.error("Error permanently deleting item:", error);
        toast({ title: "Error", description: "Could not permanently delete item.", variant: "destructive"});
    }
  };

  const handleRestoreAllItems = () => {
    if (trashedItems.length === 0) return;
    try {
        let restoredCount = 0;
        trashedItems.forEach(itemToRestore => {
            if (itemToRestore.itemType === 'hymn') {
                const activeItemsKey = 'graceNotesHymns';
                const activeItemsString = localStorage.getItem(activeItemsKey);
                let activeItems: Hymn[] = activeItemsString ? JSON.parse(activeItemsString) : [];
                if (!activeItems.find(h => h.id === (itemToRestore.data as Hymn).id)) {
                    activeItems.push(itemToRestore.data as Hymn);
                }
                localStorage.setItem(activeItemsKey, JSON.stringify(activeItems));
                restoredCount++;
            }
            // Add logic for other item types (readings, programs) here
        });

        localStorage.setItem(LOCAL_STORAGE_TRASH_KEY, JSON.stringify([]));
        setTrashedItems([]);
        toast({
            title: "All Items Restored",
            description: `${restoredCount} item(s) have been restored.`,
            duration: 1000, 
        });
    } catch (error) {
        console.error("Error restoring all items:", error);
        toast({ title: "Error", description: "Could not restore all items.", variant: "destructive" });
    }
  };

  const handlePermanentlyDeleteAllItems = () => {
    if (trashedItems.length === 0) return;
    try {
        const count = trashedItems.length;
        localStorage.setItem(LOCAL_STORAGE_TRASH_KEY, JSON.stringify([]));
        setTrashedItems([]);
        toast({
            title: "All Items Deleted Permanently",
            description: `${count} item(s) have been permanently deleted from trash.`,
        });
    } catch (error) {
        console.error("Error deleting all items permanently:", error);
        toast({ title: "Error", description: "Could not permanently delete all items.", variant: "destructive" });
    }
  };
  
  const getDaysRemaining = (trashedAt: string): number => {
    const now = new Date().getTime();
    const trashedDate = new Date(trashedAt).getTime();
    const daysInTrash = (now - trashedDate) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(TRASH_EXPIRY_DAYS - daysInTrash));
  };

  const backButton = (
    <Button variant="outline" size="sm" onClick={() => router.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  );

  return (
    <>
      <AppHeader title="Trash" actions={backButton} />
      <div className="container mx-auto px-4 pb-8">
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="mr-2 h-6 w-6 text-primary" />
              Deleted Items
            </CardTitle>
            <CardDescription>
              Items moved to trash are stored here for {TRASH_EXPIRY_DAYS} days before permanent deletion.
              You can restore them or delete them permanently before they expire.
            </CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={trashedItems.length === 0}>
                            <Layers className="mr-2 h-4 w-4" /> Restore All ({trashedItems.length})
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Restore All Items?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to restore all {trashedItems.length} items from the trash?
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestoreAllItems}>
                            Yes, Restore All
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={trashedItems.length === 0}>
                            <Eraser className="mr-2 h-4 w-4" /> Permanently Delete All ({trashedItems.length})
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Permanently Delete All Items?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. All {trashedItems.length} items in the trash will be permanently deleted.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePermanentlyDeleteAllItems} className={"bg-destructive hover:bg-destructive/90"}>
                            Yes, Delete All Permanently
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground text-center py-4">Loading trashed items...</p>
            ) : trashedItems.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <ArchiveRestore className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg">Your trash is empty.</p>
                <p className="text-sm">Deleted items will appear here.</p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-25rem)] pr-3"> {/* Adjusted height as needed */}
                <div className="space-y-3">
                {trashedItems.map((item) => {
                  const daysRemaining = getDaysRemaining(item.trashedAt);
                  const itemTitle = item.itemType === 'hymn' 
                    ? (item.data as Hymn).titleEnglish || (item.data as Hymn).titleHiligaynon
                    : item.itemType === 'reading' 
                    ? (item.data as any).title // Assuming Reading has a title
                    : 'Unknown Item';

                  return (
                    <Card key={`${item.itemType}-${item.originalId}`} className="bg-muted/20">
                      <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-lg">
                          {itemTitle}
                        </CardTitle>
                        <CardDescription className="text-xs capitalize">
                          Type: {item.itemType}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-3">
                        <p className="text-xs text-destructive flex items-center">
                          <CalendarX2 className="mr-1.5 h-3.5 w-3.5" />
                          {daysRemaining > 0 ? `Permanently deletes in ${daysRemaining} day(s)` : 'Expiring today'}
                        </p>
                      </CardContent>
                      <CardFooter className="px-4 pb-3 flex justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="sm" className="text-xs">
                                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete Now
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Permanently Delete Item?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The item "{itemTitle}" will be permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handlePermanentlyDeleteItem(item)} className={"bg-destructive hover:bg-destructive/90"}>
                                Yes, Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => handleRestoreItem(item)}>
                           <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Restore
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
                </div>
              </ScrollArea>
            )}
             <div className="mt-6 p-4 bg-secondary/50 rounded-md border border-dashed">
                <div className="flex items-start">
                    <Info className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-accent">Note:</h4>
                        <p className="text-sm text-muted-foreground">
                        Currently, only hymn deletion moves items to trash. Support for readings and programs will be added later.
                        </p>
                         <p className="text-sm text-muted-foreground mt-1">
                         Items older than {TRASH_EXPIRY_DAYS} days are automatically purged when this page is visited.
                        </p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

