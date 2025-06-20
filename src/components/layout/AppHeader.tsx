
'use client';
import type { ReactNode } from 'react';
import { Wifi, Menu, Trash2, Info, Settings as SettingsIcon, BookX, ListChecks, Trash, Sparkles } from 'lucide-react'; // Changed Bot to Sparkles
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
import DeleteHymnDialogContent from '@/components/hymnal/DeleteHymnDialogContent';
import DeleteReadingDialogContent from '@/components/readings/DeleteReadingDialogContent';
import ChatInterface from '@/components/ai/ChatInterface';
import AddHymnForm from '@/components/hymnal/AddHymnForm';
import AddReadingForm from '@/components/readings/AddReadingForm';
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
  const [isDeleteHymnDialogOpen, setIsDeleteHymnDialogOpen] = useState(false);
  const [isDeleteReadingDialogOpen, setIsDeleteReadingDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [isAddHymnDialogOpen, setIsAddHymnDialogOpen] = useState(false);
  const [isAddReadingDialogOpenStandalone, setIsAddReadingDialogOpenStandalone] = useState(false);

  const router = useRouter();

  const [currentSignal, setCurrentSignal] = useState<SignalDetail>(initialSignalDetail);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);


  useEffect(() => {
    const updateNetworkStatus = () => {
      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        const connection = navigator.connection as any;
        const mbps = connection.downlink;
        const effectiveType = connection.effectiveType;

        let level: SignalLevel = 'unknown';
        let description = 'Unknown Connection';

        if (!navigator.onLine) {
          level = 'none';
          description = 'Offline';
        } else if (mbps !== undefined && mbps > 0) {
          if (mbps >= 50) {
            level = 'strong';
            description = 'Excellent';
          } else if (mbps >= 10) {
            level = 'strong';
            description = 'Strong';
          } else if (mbps >= 1) {
            level = 'average';
            description = 'Average';
          } else if (mbps > 0.1) {
            level = 'weak';
            description = 'Poor';
          } else {
            level = 'weak';
            description = 'Poor';
          }
        } else {
          if (effectiveType === '4g' || effectiveType === '5g') {
            level = 'strong';
            description = 'Good (Cellular)';
          } else if (effectiveType === '3g') {
            level = 'average';
            description = 'Average (Cellular)';
          } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
            level = 'weak';
            description = 'Poor (Cellular)';
          } else if (effectiveType === 'wifi' && navigator.onLine) { // Added wifi check based on navigator.onLine
            description = 'Online (Wi-Fi - Speed details unavailable)';
            level = 'average'; // Default to average if specific Wi-Fi speed isn't available but online
          } else if (navigator.onLine) {
            description = 'Online (Speed details unavailable)';
            level = 'average'; // Default if online but no other details
          } else {
            // This case might be redundant if !navigator.onLine is caught first, but good for clarity
            description = 'Offline';
            level = 'none';
          }
        }
        setCurrentSignal({ description, mbps, level, effectiveType });
      } else {
        setCurrentSignal({ description: 'Network API not supported', level: 'unknown' });
      }
    };

    updateNetworkStatus();

    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = navigator.connection as any;
      connection.addEventListener('change', updateNetworkStatus);
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
        return 'text-slate-400 dark:text-slate-600'; // Adjusted for visibility in dark mode
      case 'unknown':
      default:
        return 'text-muted-foreground';
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

  const handleDataChangeSuccess = () => {
    router.refresh();
  }

  return (
    <>
      <header className="bg-card shadow-sm mb-4 md:mb-6 print:hidden">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {typeof title === 'string' && title.length > 0 ? (
              <h1 className="text-2xl font-headline font-semibold text-primary sm:text-3xl">{title}</h1>
            ) : typeof title === 'string' && title.length === 0 ? (
              null
            ) : (
              title
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
                        <Sparkles className="h-6 w-6" />
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] h-[70vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Chat with SBC Church App AI</DialogTitle>
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
                       {/* Re-added FilePlus2 as it's a distinct action icon now */}
                       {/* Assuming FilePlus2 was previously removed, ensure it's imported if needed */}
                       {/* For now, using a generic icon if FilePlus2 is unavailable. */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                      <span>Add Hymn</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsAddReadingDialogOpenStandalone(true)}>
                       {/* Same assumption for icon as above */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                      <span>Add Reading</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => router.push('/hymn-url-editor')}>
                      <ListChecks className="mr-2 h-4 w-4" />
                      <span>URL Management</span>
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
                     <DropdownMenuItem
                      onSelect={() => router.push('/trash')}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Trash</span>
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

      <Dialog open={isAddHymnDialogOpen} onOpenChange={setIsAddHymnDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[85vh] flex flex-col sm:rounded-[25px]">
          <DialogHeader>
            <DialogTitle>Add New Hymn</DialogTitle>
            <DialogDescription>
              Fill in the details for the new hymn. Hiligaynon title and lyrics are required.
            </DialogDescription>
          </DialogHeader>
          <AddHymnForm
            onFormSubmit={() => {
              setIsAddHymnDialogOpen(false);
              handleDataChangeSuccess();
            }}
            className="pt-0 flex-1 min-h-0" 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddReadingDialogOpenStandalone} onOpenChange={setIsAddReadingDialogOpenStandalone}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reading (Simulated)</DialogTitle>
            <DialogDescription>
              Enter the details for the new reading. This action is currently simulated.
            </DialogDescription>
          </DialogHeader>
          <AddReadingForm
            onFormSubmit={() => {
              setIsAddReadingDialogOpenStandalone(false);
              // handleDataChangeSuccess(); // No actual data change yet
            }}
            className="pt-0" 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteHymnDialogOpen} onOpenChange={setIsDeleteHymnDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move Hymns to Trash</DialogTitle>
            <DialogDescription>
              Select hymns to move to trash. They will be permanently deleted after 30 days.
            </DialogDescription>
          </DialogHeader>
          <DeleteHymnDialogContent
            onOpenChange={setIsDeleteHymnDialogOpen}
            onDeleteSuccess={() => {
              setIsDeleteHymnDialogOpen(false);
              handleDataChangeSuccess();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteReadingDialogOpen} onOpenChange={setIsDeleteReadingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Readings (Simulated)</DialogTitle>
            <DialogDescription>
              Select readings to "delete". This action is currently simulated.
            </DialogDescription>
          </DialogHeader>
          <DeleteReadingDialogContent
            onOpenChange={setIsDeleteReadingDialogOpen}
            onDeleteSuccess={() => {
              setIsDeleteReadingDialogOpen(false);
              // handleDataChangeSuccess(); // Uncomment if actual data change occurs
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

