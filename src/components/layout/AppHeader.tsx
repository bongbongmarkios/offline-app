
'use client';
import type { ReactNode } from 'react';
import { Wifi, Menu, PlusCircle, Trash2, Info, Settings as SettingsIcon, BookPlus, BookX, Wand2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from 'react';
import AddHymnForm from '@/components/hymnal/AddHymnForm';
import AddReadingForm from '@/components/readings/AddReadingForm';
import DeleteHymnDialogContent from '@/components/hymnal/DeleteHymnDialogContent';
import DeleteReadingDialogContent from '@/components/readings/DeleteReadingDialogContent';
import ChatInterface from '@/components/ai/ChatInterface';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


interface AppHeaderProps {
  title: ReactNode;
  actions?: ReactNode;
  hideDefaultActions?: boolean;
}

type SignalLevel = 'strong' | 'average' | 'weak' | 'none' | 'unknown';

interface SignalDetail {
  description: string;
  mbps?: number;
  level: SignalLevel;
  effectiveType?: string;
}

const initialSignalDetail: SignalDetail = {
  description: "Initializing...",
  level: 'unknown',
};


export default function AppHeader({ title, actions, hideDefaultActions }: AppHeaderProps) {
  const [isAddHymnDialogOpen, setIsAddHymnDialogOpen] = useState(false);
  const [isAddReadingDialogOpen, setIsAddReadingDialogOpen] = useState(false);
  const [isDeleteHymnDialogOpen, setIsDeleteHymnDialogOpen] = useState(false);
  const [isDeleteReadingDialogOpen, setIsDeleteReadingDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const router = useRouter();

  const [currentSignal, setCurrentSignal] = useState<SignalDetail>(initialSignalDetail);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);


  useEffect(() => {
    const updateNetworkStatus = () => {
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        const connection = navigator.connection as any; // Type assertion for broader compatibility
        const mbps = connection.downlink; // Estimated download speed in Mbps
        const effectiveType = connection.effectiveType; // e.g., '4g', '3g', 'wifi'

        let level: SignalLevel = 'unknown';
        let description = 'Unknown Connection';

        if (!navigator.onLine) {
          level = 'none';
          description = 'Offline';
        } else if (mbps !== undefined && mbps > 0) {
          if (mbps >= 50) { // Example: Fiber, very fast Cable/5G
            level = 'strong';
            description = 'Excellent';
          } else if (mbps >= 10) { // Example: Good Cable, LTE, decent WiFi
            level = 'strong';
            description = 'Strong';
          } else if (mbps >= 1) { // Example: 3G, slower DSL/WiFi
            level = 'average';
            description = 'Average';
          } else if (mbps > 0.1) { // Example: 2G, very poor connection
            level = 'weak';
            description = 'Weak';
          } else { // Barely usable or very slow
            level = 'weak';
            description = 'Poor';
          }
        } else { // Fallback if downlink is not available or 0, but online
          if (effectiveType === '4g' || effectiveType === '5g') { // 5G might not be in all `effectiveType` enums
            level = 'strong';
            description = 'Good (Cellular)';
          } else if (effectiveType === '3g') {
            level = 'average';
            description = 'Average (Cellular)';
          } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
            level = 'weak';
            description = 'Poor (Cellular)';
          } else if (effectiveType === 'wifi' && navigator.onLine) {
            // If type is wifi but no speed, assume average.
            description = 'Online (Wi-Fi - Speed details unavailable)';
            level = 'average'; 
          } else if (navigator.onLine) {
            // Generic online status if no other details
            description = 'Online (Speed details unavailable)';
            level = 'average';
          } else {
            // This case should ideally be caught by !navigator.onLine, but as a final fallback:
            description = 'Offline';
            level = 'none';
          }
        }
        setCurrentSignal({ description, mbps, level, effectiveType });
      } else {
        // Fallback for environments without navigator.connection (e.g., some SSR contexts or older browsers)
        setCurrentSignal({ description: 'Network API not supported', level: 'unknown' });
      }
    };

    updateNetworkStatus(); // Initial check

    // Set up event listeners if navigator.connection is available
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = navigator.connection as any;
      connection.addEventListener('change', updateNetworkStatus);
      // Also listen to general online/offline events for robustness
      window.addEventListener('online', updateNetworkStatus);
      window.addEventListener('offline', updateNetworkStatus);

      return () => {
        connection.removeEventListener('change', updateNetworkStatus);
        window.removeEventListener('online', updateNetworkStatus);
        window.removeEventListener('offline', updateNetworkStatus);
      };
    }
  }, []);

  const getWifiIconColor = (): string => {
    switch (currentSignal.level) {
      case 'strong':
        return 'text-green-500';
      case 'average':
        return 'text-orange-500';
      case 'weak':
        return 'text-red-500';
      case 'none':
        return 'text-slate-400 dark:text-slate-600'; // Muted color for offline
      case 'unknown':
      default:
        return 'text-muted-foreground'; // Default color for unknown or unsupported
    }
  };

  const getWifiAriaLabel = (): string => {
    let label = `Wifi Status: ${currentSignal.description}`;
    if (currentSignal.mbps !== undefined && currentSignal.level !== 'none') {
      label += `, ~${currentSignal.mbps.toFixed(1)} Mbps`;
    }
    if (currentSignal.effectiveType && currentSignal.level !== 'none') {
      label += ` (Type: ${currentSignal.effectiveType})`;
    }
    label += ". Click for details.";
    return label;
  }


  const handleAddHymnSubmit = () => {
    setIsAddHymnDialogOpen(false);
    router.refresh();
  };

  const handleAddReadingSubmit = () => {
    setIsAddReadingDialogOpen(false);
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    // This function is called when hymns or readings are deleted.
    // Refresh the current page to reflect changes.
    router.refresh();
  }

  return (
    <>
      <header className="bg-card shadow-sm mb-4 md:mb-6 print:hidden">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Render title: if string and non-empty, use h1; if string and empty, render nothing; otherwise, render as is (ReactNode) */}
            {typeof title === 'string' && title.length > 0 ? (
              <h1 className="text-2xl font-headline font-semibold text-primary sm:text-3xl">{title}</h1>
            ) : typeof title === 'string' && title.length === 0 ? (
              null // Render nothing if title is an empty string
            ) : (
              title // Render as ReactNode if it's not a string or if it's complex JSX
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}

            {!hideDefaultActions && (
              <>
                <Popover open={isStatusPopoverOpen} onOpenChange={setIsStatusPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={getWifiAriaLabel()}>
                      <Wifi className={`h-6 w-6 ${getWifiIconColor()}`} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" side="bottom" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Internet Status</h4>
                      <p className="text-sm">
                        Signal: <span className={cn("font-semibold", getWifiIconColor())}>{currentSignal.description}</span>
                      </p>
                      {currentSignal.mbps !== undefined && currentSignal.level !== 'none' && (
                        <p className="text-sm text-muted-foreground">
                          Speed: ~{currentSignal.mbps.toFixed(1)} Mbps
                        </p>
                      )}
                       {currentSignal.effectiveType && currentSignal.level !== 'none' && (
                        <p className="text-sm text-muted-foreground">
                          Type: {currentSignal.effectiveType}
                        </p>
                      )}
                      {currentSignal.level === 'unknown' && (
                        <p className="text-xs text-muted-foreground italic">Browser may not fully support network status updates.</p>
                      )}
                       {currentSignal.level === 'none' && (
                        <p className="text-sm font-semibold text-destructive">You are currently offline.</p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>


                <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open AI Chat">
                      <Wand2 className="h-6 w-6" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] h-[70vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Chat with GraceNotes AI</DialogTitle>
                      <DialogDescription>
                        Ask questions or get help.
                      </DialogDescription>
                    </DialogHeader>
                    <ChatInterface />
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open menu">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setIsAddHymnDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Add Hymn</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsAddReadingDialogOpen(true)}>
                      <BookPlus className="mr-2 h-4 w-4" />
                      <span>Add Reading</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push('/hymnal')}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      <span>URL</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => setIsDeleteHymnDialogOpen(true)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Hymn</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setIsDeleteReadingDialogOpen(true)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <BookX className="mr-2 h-4 w-4" />
                      <span>Delete Reading</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => router.push('/settings')}>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push('/about')}>
                      <Info className="mr-2 h-4 w-4" />
                      <span>About</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Add Hymn Dialog */}
      <Dialog open={isAddHymnDialogOpen} onOpenChange={setIsAddHymnDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[85vh] flex flex-col sm:rounded-[25px]">
          <DialogHeader>
            <DialogTitle>Add New Hymn</DialogTitle>
            <DialogDescription>
              Fill in the details for the new hymn. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <AddHymnForm onFormSubmit={handleAddHymnSubmit} className="pt-0 flex-1 min-h-0" />
        </DialogContent>
      </Dialog>

      {/* Add Reading Dialog */}
      <Dialog open={isAddReadingDialogOpen} onOpenChange={setIsAddReadingDialogOpen}>
        <DialogContent className="sm:max-w-[600px]"> {/* Adjusted max-width */}
          <DialogHeader>
            <DialogTitle>Add New Reading</DialogTitle>
            <DialogDescription>
              Fill in the details for the new responsive reading.
            </DialogDescription>
          </DialogHeader>
          <AddReadingForm onFormSubmit={handleAddReadingSubmit} className="pt-0" />
        </DialogContent>
      </Dialog>

      {/* Delete Hymn Dialog */}
      <Dialog open={isDeleteHymnDialogOpen} onOpenChange={setIsDeleteHymnDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Hymns</DialogTitle>
            <DialogDescription>
              Select the hymns you want to delete. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DeleteHymnDialogContent
            onOpenChange={setIsDeleteHymnDialogOpen}
            onDeleteSuccess={() => {
              setIsDeleteHymnDialogOpen(false); // Close dialog
              handleDeleteSuccess(); // Refresh page
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Reading Dialog */}
      <Dialog open={isDeleteReadingDialogOpen} onOpenChange={setIsDeleteReadingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Readings</DialogTitle>
            <DialogDescription>
              Select the readings you want to delete. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DeleteReadingDialogContent
            onOpenChange={setIsDeleteReadingDialogOpen}
            onDeleteSuccess={() => {
              setIsDeleteReadingDialogOpen(false); // Close dialog
              handleDeleteSuccess(); // Refresh page
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
