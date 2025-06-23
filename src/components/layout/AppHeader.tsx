'use client';
import type { ReactNode } from 'react';
import { Search, Wifi, Menu, Trash2, Info, Settings as SettingsIcon, BookX, ListChecks, Trash, Sparkles, Bot } from 'lucide-react'; 
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
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import HymnSearchDialog from '@/components/hymnal/HymnSearchDialog';
import ReadingSearchDialog from '@/components/readings/ReadingSearchDialog';
import ProgramSearchDialog from '@/components/program/ProgramSearchDialog';


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
  const [isHymnSearchOpen, setIsHymnSearchOpen] = useState(false);
  const [isReadingSearchOpen, setIsReadingSearchOpen] = useState(false);
  const [isProgramSearchOpen, setIsProgramSearchOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  const [currentSignal, setCurrentSignal] = useState<SignalDetail>(initialSignalDetail);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);

  const handleSearchOpen = () => {
    if (pathname.startsWith('/program')) {
      setIsProgramSearchOpen(true);
    } else if (pathname.startsWith('/readings')) {
      setIsReadingSearchOpen(true);
    } else {
      setIsHymnSearchOpen(true);
    }
  };

  useEffect(() => {
    // Keyboard shortcut for search
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (pathname.startsWith('/program')) {
          setIsProgramSearchOpen((open) => !open);
        } else if (pathname.startsWith('/readings')) {
          setIsReadingSearchOpen((open) => !open)
        } else {
          setIsHymnSearchOpen((open) => !open)
        }
      }
    }
    document.addEventListener('keydown', down);

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
          } else if (effectiveType === 'wifi' && navigator.onLine) { 
            description = 'Online (Wi-Fi - Speed details unavailable)';
            level = 'average'; 
          } else if (navigator.onLine) {
            description = 'Online (Speed details unavailable)';
            level = 'average'; 
          } else {
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

    let connection: any;
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      connection = navigator.connection as any;
      connection.addEventListener('change', updateNetworkStatus);
    }
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    return () => {
        document.removeEventListener('keydown', down)
        if (connection) {
            connection.removeEventListener('change', updateNetworkStatus);
        }
        window.removeEventListener('online', updateNetworkStatus);
        window.removeEventListener('offline', updateNetworkStatus);
    };

  }, [pathname]);

  const getWifiIconColor = (): string => {
    switch (currentSignal.level) {
      case 'strong':
        return 'text-green-500';
      case 'average':
        return 'text-orange-500';
      case 'weak':
        return 'text-red-500';
      case 'none':
        return 'text-slate-400 dark:text-slate-600'; 
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
                <Button variant="ghost" size="icon" aria-label="Open search" onClick={handleSearchOpen}>
                  <Search className="h-6 w-6" />
                </Button>
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
                    <DropdownMenuItem onSelect={handleSearchOpen}>
                      <Search className="mr-2 h-4 w-4" />
                      <span>Search</span>
                      <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </DropdownMenuItem>
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
      
      <HymnSearchDialog open={isHymnSearchOpen} onOpenChange={setIsHymnSearchOpen} />
      <ReadingSearchDialog open={isReadingSearchOpen} onOpenChange={setIsReadingSearchOpen} />
      <ProgramSearchDialog open={isProgramSearchOpen} onOpenChange={setIsProgramSearchOpen} />

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
