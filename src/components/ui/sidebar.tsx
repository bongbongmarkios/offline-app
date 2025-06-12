
"use client"

import * as React from "react"
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft, PlusCircle, Settings, HelpCircle, Info, Trash2, Music, ListOrdered, BookOpenText, Wand2, BookMarked, Database, Upload, FileUp, Loader2, X, FileText } from "lucide-react"
import Image from "next/image";

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader as UiSheetHeader,
  SheetTitle as UiSheetTitle
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { sampleHymns } from "@/data/hymns";
import type { Hymn } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const PROCESSED_FILES_INDEX_KEY = "processedFilesIndex_v2";
const FILE_CONTENT_PREFIX_KEY = "fileContent_v2_";

interface StoredFileMetadata {
  id: string;
  name: string;
  type: string; // Will primarily be 'text/plain' now
  size: number;
  lastModified: number;
  isTextContentStored: boolean; // Will always be true for stored files
}

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    const [isAddHymnDialogOpen, setIsAddHymnDialogOpen] = React.useState(false);
    const [hymnTitleHiligaynon, setHymnTitleHiligaynon] = React.useState('');
    const [hymnTitleFilipino, setHymnTitleFilipino] = React.useState('');
    const [hymnTitleEnglish, setHymnTitleEnglish] = React.useState('');
    const [hymnKey, setHymnKey] = React.useState('');
    const [hymnPageNumber, setHymnPageNumber] = React.useState('');
    const [hymnLyricsHiligaynon, setHymnLyricsHiligaynon] = React.useState('');
    const [hymnLyricsFilipino, setHymnLyricsFilipino] = React.useState('');
    const [hymnLyricsEnglish, setHymnLyricsEnglish] = React.useState('');
    const { toast } = useToast();

    const [isDeleteHymnsDialogOpen, setIsDeleteHymnsDialogOpen] = React.useState(false);
    const [selectedHymnIds, setSelectedHymnIds] = React.useState<string[]>([]);

    const [isDataDialogOpen, setIsDataDialogOpen] = React.useState(false);

    const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);
    const [selectedFilesList, setSelectedFilesList] = React.useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = React.useState<string | null>(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [processedFiles, setProcessedFiles] = React.useState<StoredFileMetadata[]>([]);

    const [isViewFileDialogOpen, setIsViewFileDialogOpen] = React.useState(false);
    const [viewFileContent, setViewFileContent] = React.useState<string | undefined>('');
    const [viewFileName, setViewFileName] = React.useState('');

    React.useEffect(() => {
      if (typeof window !== "undefined") {
        const storedIndex = localStorage.getItem(PROCESSED_FILES_INDEX_KEY);
        if (storedIndex) {
          try {
            setProcessedFiles(JSON.parse(storedIndex));
          } catch (e) {
            console.error("Error parsing processed files index from localStorage", e);
            localStorage.removeItem(PROCESSED_FILES_INDEX_KEY);
          }
        }
      }
    }, []);

    const saveProcessedFilesIndex = (updatedFiles: StoredFileMetadata[]) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(PROCESSED_FILES_INDEX_KEY, JSON.stringify(updatedFiles));
      }
    };


    const handleAddHymnSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!hymnTitleHiligaynon || !hymnLyricsHiligaynon) {
        toast({
          title: "Error",
          description: "Hiligaynon Title and Lyrics are required.",
          variant: "destructive",
        });
        return;
      }
      console.log('New Hymn (from dialog):', {
        titleHiligaynon: hymnTitleHiligaynon,
        titleFilipino: hymnTitleFilipino,
        titleEnglish: hymnTitleEnglish,
        key: hymnKey,
        pageNumber: hymnPageNumber,
        lyricsHiligaynon: hymnLyricsHiligaynon,
        lyricsFilipino: hymnLyricsFilipino,
        lyricsEnglish: hymnLyricsEnglish,
      });
      toast({
        title: "Hymn Added (Simulated)",
        description: `"${hymnTitleHiligaynon}" has been added to the list (not actually saved).`,
      });
      setHymnTitleHiligaynon('');
      setHymnTitleFilipino('');
      setHymnTitleEnglish('');
      setHymnKey('');
      setHymnPageNumber('');
      setHymnLyricsHiligaynon('');
      setHymnLyricsFilipino('');
      setHymnLyricsEnglish('');
      setIsAddHymnDialogOpen(false);
    };

    const handleHymnSelectionChange = (hymnId: string, checked: boolean) => {
      setSelectedHymnIds(prevSelectedIds => {
        if (checked) {
          return [...prevSelectedIds, hymnId];
        } else {
          return prevSelectedIds.filter(id => id !== hymnId);
        }
      });
    };

    const handleDeleteSelectedHymns = () => {
      if (selectedHymnIds.length === 0) {
        toast({
          title: "No Hymns Selected",
          description: "Please select at least one hymn to delete.",
          variant: "destructive",
        });
        return;
      }
      console.log("Deleting Hymns (Simulated):", selectedHymnIds);
      toast({
        title: "Hymns Deleted (Simulated)",
        description: `${selectedHymnIds.length} hymn(s) have been "deleted". This is a simulation.`,
      });
      setSelectedHymnIds([]);
      setIsDeleteHymnsDialogOpen(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        let filesArray = Array.from(event.target.files);
        if (filesArray.length > 10) {
          toast({
            title: "File Limit Exceeded",
            description: "You can select up to 10 text files at a time.",
            variant: "destructive",
          });
          filesArray = filesArray.slice(0, 10);
        }
        setSelectedFilesList(filesArray);
        setUploadStatus(filesArray.length > 0 ? `${filesArray.length} file(s) selected.` : null);
      } else {
        setSelectedFilesList([]);
        setUploadStatus(null);
      }
    };

    const handleClearFile = () => {
      setSelectedFilesList([]);
      setUploadStatus(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleProcessFile = async () => {
      if (selectedFilesList.length === 0) {
        setUploadStatus("No files selected.");
        toast({ title: "Error", description: "No files selected.", variant: "destructive" });
        return;
      }

      setIsProcessing(true);
      setUploadStatus(`Processing ${selectedFilesList.length} file(s)...`);

      let newlyAddedMetadataList: StoredFileMetadata[] = [];
      let filesProcessedCount = 0;
      let filesSkippedCount = 0;

      for (const file of selectedFilesList) {
        const deterministicFileId = `${file.name}-${file.size}-${file.lastModified}`;

        const isDuplicate = processedFiles.some(pf => pf.id === deterministicFileId);
        if (isDuplicate) {
          toast({
            title: "File Skipped",
            description: `"${file.name}" already exists and was not re-added.`,
          });
          filesSkippedCount++;
          continue;
        }


        if (file.type === "text/plain") {
          try {
            const text = await file.text();
            if (typeof window !== "undefined") {
              localStorage.setItem(`${FILE_CONTENT_PREFIX_KEY}${deterministicFileId}`, text);
            }
            const newFileMetadata: StoredFileMetadata = {
              id: deterministicFileId,
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
              isTextContentStored: true,
            };
            newlyAddedMetadataList.push(newFileMetadata);
            filesProcessedCount++;
            toast({ title: "Text File Stored", description: `Successfully stored "${file.name}".` });
          } catch (error) {
            console.error(`Error reading text file "${file.name}":`, error);
            toast({ title: "Error", description: `Could not read text file "${file.name}".`, variant: "destructive" });
            continue;
          }
        } else {
          toast({ title: "Unsupported File", description: `File "${file.name}" has an unsupported type: ${file.type || 'unknown'}. Only .txt files are supported. Skipped.`, variant: "destructive" });
          continue;
        }
      }

      if (newlyAddedMetadataList.length > 0) {
        const updatedAllFiles = [...processedFiles, ...newlyAddedMetadataList];
        setProcessedFiles(updatedAllFiles);
        saveProcessedFilesIndex(updatedAllFiles);
      }
      
      let finalStatus = `${filesProcessedCount} file(s) processed and stored.`;
      if (filesSkippedCount > 0) {
        finalStatus += ` ${filesSkippedCount} file(s) skipped as duplicates.`
      }
      setUploadStatus(finalStatus);
      setIsProcessing(false);
      handleClearFile();
    };

    const handleViewTextFile = (file: StoredFileMetadata) => {
      if (file.isTextContentStored && typeof window !== "undefined") {
        const content = localStorage.getItem(`${FILE_CONTENT_PREFIX_KEY}${file.id}`);
        if (content !== null) {
          setViewFileName(file.name);
          setViewFileContent(content);
          setIsViewFileDialogOpen(true);
        } else {
          toast({ title: "Error", description: "Could not retrieve file content.", variant: "destructive"});
        }
      }
    };


    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <>
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar text-sidebar-foreground [&>button]:hidden flex flex-col p-0"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <UiSheetHeader className="p-4 border-b border-sidebar-border flex-shrink-0 flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-2">
                <Image src="https://i.imgur.com/BJ43v7S.png" alt="SBC APP Logo" width={36} height={36} data-ai-hint="logo" className="shrink-0" />
                <UiSheetTitle className="text-lg font-headline text-primary">SBC APP</UiSheetTitle>
              </div>
            </UiSheetHeader>

            <div className="p-4 border-b border-sidebar-border space-y-2">
              <Dialog open={isAddHymnDialogOpen} onOpenChange={setIsAddHymnDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="lg" className="w-full flex items-center justify-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Add New Hymn
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-4 max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-[25px]">
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Add New Hymn</DialogTitle>
                    <DialogDescription>Fill in the details for the new hymn. Hiligaynon is the default language. Click save when you&apos;re done.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddHymnSubmit}>
                    <ScrollArea className="h-[65vh] pr-3">
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="dialog-hymn-title-hiligaynon" className="font-semibold">Title (Hiligaynon)</Label>
                          <Input id="dialog-hymn-title-hiligaynon" value={hymnTitleHiligaynon} onChange={(e) => setHymnTitleHiligaynon(e.target.value)} placeholder="e.g., Daku Nga Kalipay" required className="border-muted-foreground mt-1"/>
                        </div>
                        <div>
                          <Label htmlFor="dialog-hymn-title-filipino">Title (Filipino) (Optional)</Label>
                          <Input id="dialog-hymn-title-filipino" value={hymnTitleFilipino} onChange={(e) => setHymnTitleFilipino(e.target.value)} placeholder="e.g., Dakilang Kagalakan" className="border-muted-foreground mt-1"/>
                        </div>
                        <div>
                          <Label htmlFor="dialog-hymn-title-english">Title (English) (Optional)</Label>
                          <Input id="dialog-hymn-title-english" value={hymnTitleEnglish} onChange={(e) => setHymnTitleEnglish(e.target.value)} placeholder="e.g., Amazing Grace" className="border-muted-foreground mt-1"/>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dialog-hymn-key">Key (Optional)</Label>
                            <Input id="dialog-hymn-key" value={hymnKey} onChange={(e) => setHymnKey(e.target.value)} placeholder="e.g., C Major" className="border-muted-foreground mt-1"/>
                          </div>
                          <div>
                            <Label htmlFor="dialog-hymn-page-number">Page Number (Optional)</Label>
                            <Input id="dialog-hymn-page-number" value={hymnPageNumber} onChange={(e) => setHymnPageNumber(e.target.value)} placeholder="e.g., 101" className="border-muted-foreground mt-1"/>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="dialog-hymn-lyrics-hiligaynon" className="font-semibold">Lyrics (Hiligaynon)</Label>
                          <Textarea id="dialog-hymn-lyrics-hiligaynon" value={hymnLyricsHiligaynon} onChange={(e) => setHymnLyricsHiligaynon(e.target.value)} placeholder="Enter Hiligaynon lyrics here..." rows={10} required className="border-muted-foreground mt-1"/>
                        </div>
                        <div>
                          <Label htmlFor="dialog-hymn-lyrics-filipino">Lyrics (Filipino) (Optional)</Label>
                          <Textarea id="dialog-hymn-lyrics-filipino" value={hymnLyricsFilipino} onChange={(e) => setHymnLyricsFilipino(e.target.value)} placeholder="Enter Filipino lyrics here..." rows={6} className="border-muted-foreground mt-1"/>
                        </div>
                        <div>
                          <Label htmlFor="dialog-hymn-lyrics-english">Lyrics (English) (Optional)</Label>
                          <Textarea id="dialog-hymn-lyrics-english" value={hymnLyricsEnglish} onChange={(e) => setHymnLyricsEnglish(e.target.value)} placeholder="Enter English lyrics here..." rows={6} className="border-muted-foreground mt-1"/>
                        </div>
                      </div>
                    </ScrollArea>
                    <DialogFooter className="pt-4 border-t">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save Hymn</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteHymnsDialogOpen} onOpenChange={setIsDeleteHymnsDialogOpen}>
                <DialogTrigger asChild>
                   <Button variant="destructive" size="lg" className="w-full flex items-center justify-center gap-2">
                    <Trash2 className="mr-2 h-5 w-5" /> Delete Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-4 max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-[25px]">
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Delete Hymns</DialogTitle>
                    <DialogDescription>Select hymns from the list to delete. This action is simulated and will not permanently alter the data.</DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] my-4 pr-3">
                    <div className="space-y-2">
                      {sampleHymns.map((hymn) => (
                        <div key={hymn.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/50">
                          <Checkbox
                            id={`delete-hymn-${hymn.id}`}
                            checked={selectedHymnIds.includes(hymn.id)}
                            onCheckedChange={(checked) => handleHymnSelectionChange(hymn.id, !!checked)}
                            aria-labelledby={`label-delete-hymn-${hymn.id}`}
                          />
                          <Label htmlFor={`delete-hymn-${hymn.id}`} id={`label-delete-hymn-${hymn.id}`} className="flex-grow cursor-pointer">
                            {hymn.title} {hymn.number ? `(#${hymn.number})` : ''}
                          </Label>
                        </div>
                      ))}
                      {sampleHymns.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No hymns available to delete.</p>
                      )}
                    </div>
                  </ScrollArea>
                  <DialogFooter className="pt-4 border-t">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDeleteSelectedHymns}
                      disabled={selectedHymnIds.length === 0}
                    >
                      Delete Selected ({selectedHymnIds.length})
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isDataDialogOpen} onOpenChange={setIsDataDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2">
                    <Database className="mr-2 h-5 w-5" /> Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-4 max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-[25px]">
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Processed Text Files</DialogTitle>
                    <DialogDescription>
                      List of text files processed and stored. Click on a file to view its content.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] my-4 pr-3">
                    {processedFiles.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No files processed yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {processedFiles.map((file) => (
                          <Button
                            key={file.id}
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 border rounded-md bg-background hover:bg-muted/50"
                            onClick={() => handleViewTextFile(file)}
                            title={`View ${file.name}`}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                              <div className="flex-grow text-left overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                                <div className="flex items-center gap-2 text-xs mt-1">
                                  <Badge variant="secondary">{file.type}</Badge>
                                  <Badge variant="outline">{(file.size / 1024).toFixed(2)} KB</Badge>
                                </div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <DialogFooter className="pt-4 border-t">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isUploadDialogOpen} onOpenChange={(isOpen) => { setIsUploadDialogOpen(isOpen); if (!isOpen) { handleClearFile(); setIsProcessing(false); }}}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2">
                    <Upload className="mr-2 h-5 w-5" /> Upload Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-4 max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-[25px]">
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                      <FileUp className="h-6 w-6 text-primary" /> Upload Text Files
                    </DialogTitle>
                    <DialogDescription>
                      Select up to 10 .txt (text) files to upload. Text file content will be stored.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Choose .txt File(s)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          ref={fileInputRef}
                          id="file-upload"
                          type="file"
                          accept=".txt,text/plain"
                          multiple
                          onChange={handleFileChange}
                          className="border-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 flex-grow"
                        />
                        {selectedFilesList.length > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClearFile}
                            aria-label="Remove selected files"
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {selectedFilesList.length > 0 && (
                        <ScrollArea className="max-h-32 mt-2 border rounded-md p-2">
                          <ul className="text-sm space-y-1">
                            {selectedFilesList.map(file => (
                              <li key={file.name + file.lastModified + file.size} className="truncate flex items-center justify-between">
                                <span>{file.name} ({(file.size/1024).toFixed(2)} KB)</span>
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>
                      )}
                    </div>
                    {uploadStatus && (
                      <p className={cn("text-sm", uploadStatus.includes("Error") || uploadStatus.includes("Invalid") || uploadStatus.includes("Unsupported") ? "text-destructive" : "text-muted-foreground")}>
                        {uploadStatus}
                      </p>
                    )}
                  </div>
                  <DialogFooter className="pt-4 border-t">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Close</Button>
                    </DialogClose>
                    <Button
                      type="button"
                      onClick={handleProcessFile}
                      disabled={selectedFilesList.length === 0 || isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {isProcessing ? "Processing..." : `Process ${selectedFilesList.length} File(s)`}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </div>

            <div className="flex-grow overflow-y-auto">
              {React.Children.map(children, child => {
                if (React.isValidElement(child) && (child.type as any).displayName === 'SidebarContent') {
                  return React.cloneElement(child as React.ReactElement<any>, { setOpenMobile });
                }
                return null;
              })}
            </div>

            <div className="mt-auto p-4 border-t border-sidebar-border space-y-2">
              <Button asChild variant="ghost" className="w-full justify-start text-sm" onClick={() => { setOpenMobile(false); }}>
                <Link href="/settings">
                  <Settings className="mr-2 h-5 w-5" /> Settings
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start text-sm" onClick={() => { setOpenMobile(false); }}>
                <Link href="/help">
                  <HelpCircle className="mr-2 h-5 w-5" /> Help
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start text-sm" onClick={() => { setOpenMobile(false); }}>
                <Link href="/about">
                  <Info className="mr-2 h-5 w-5" /> About
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Dialog open={isViewFileDialogOpen} onOpenChange={setIsViewFileDialogOpen}>
            <DialogContent className="p-4 max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] rounded-[25px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" /> Viewing: {viewFileName}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[65vh] my-4 pr-3 border rounded-md bg-muted/20">
                    <pre className="p-4 text-sm whitespace-pre-wrap break-words">
                        {viewFileContent || "No content to display."}
                    </pre>
                </ScrollArea>
                <DialogFooter className="pt-4 border-t">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { setOpenMobile?: (open: boolean) => void }
>(({ className, children, setOpenMobile, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    >
    {React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.type as any).displayName === 'SidebarNav' && setOpenMobile) {
          return React.cloneElement(child, { setOpenMobile });
        }
        return child;
      })}
    </div>
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul"> & { setOpenMobile?: (open: boolean) => void }
>(({ className, children, setOpenMobile, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  >
    {React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.type as any).displayName === 'SidebarMenuItem' && setOpenMobile) {
          return React.cloneElement(child, { setOpenMobile });
        }
        return child;
      })}
  </ul>
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & { setOpenMobile?: (open: boolean) => void }
>(({ className, children, setOpenMobile, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  >
    {React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.type as any).displayName === 'SidebarMenuButton' && setOpenMobile) {
          return React.cloneElement(child as React.ReactElement<any>, { onClick: () => {
            if (child.props.onClick) child.props.onClick();
            if (setOpenMobile) setOpenMobile(false);
          }});
        }
        return child;
      })}
  </li>
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        onClick={onClick}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}


    