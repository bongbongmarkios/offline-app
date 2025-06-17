
'use client';
import type { ReactNode } from 'react';
import { Wifi, Menu, PlusCircle, Trash2, Info, Settings as SettingsIcon, BookPlus, BookX, Wand2 } from 'lucide-react';
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
import { useState, useEffect } from 'react';
import AddHymnForm from '@/components/hymnal/AddHymnForm';
import AddReadingForm from '@/components/readings/AddReadingForm';
import DeleteHymnDialogContent from '@/components/hymnal/DeleteHymnDialogContent';
import DeleteReadingDialogContent from '@/components/readings/DeleteReadingDialogContent'; 
import ChatInterface from '@/components/ai/ChatInterface';
import { useRouter } from 'next/navigation';


interface AppHeaderProps {
  title: ReactNode;
  actions?: ReactNode;
  hideDefaultActions?: boolean; 
}

type SignalStrength = 'strong' | 'average' | 'weak' | 'none';

export default function AppHeader({ title, actions, hideDefaultActions }: AppHeaderProps) {
  const [isAddHymnDialogOpen, setIsAddHymnDialogOpen] = useState(false);
  const [isAddReadingDialogOpen, setIsAddReadingDialogOpen] = useState(false);
  const [isDeleteHymnDialogOpen, setIsDeleteHymnDialogOpen] = useState(false);
  const [isDeleteReadingDialogOpen, setIsDeleteReadingDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const router = useRouter();

  const [signalStrength, setSignalStrength] = useState<SignalStrength>('strong');

  useEffect(() => {
    const signalLevels: SignalStrength[] = ['strong', 'average', 'weak', 'none'];
    let currentIndex = 0; // Start with 'strong' as per initial state

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % signalLevels.length;
      setSignalStrength(signalLevels[currentIndex]);
    }, 3000); // Change signal every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const getWifiIconColor = (): string => {
    switch (signalStrength) {
      case 'strong':
        return 'text-green-500';
      case 'average':
        return 'text-orange-500';
      case 'weak':
        return 'text-red-500';
      case 'none':
      default:
        return 'text-muted-foreground';
    }
  };
  
  const getWifiAriaLabel = (): string => {
    switch (signalStrength) {
      case 'strong':
        return 'Wifi Status: Strong Signal';
      case 'average':
        return 'Wifi Status: Average Signal';
      case 'weak':
        return 'Wifi Status: Weak Signal';
      case 'none':
      default:
        return 'Wifi Status: No Signal / Unknown';
    }
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
                <Button variant="ghost" size="icon" aria-label={getWifiAriaLabel()}>
                  <Wifi className={`h-6 w-6 ${getWifiIconColor()}`} />
                </Button>

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

      <Dialog open={isAddReadingDialogOpen} onOpenChange={setIsAddReadingDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Reading</DialogTitle>
            <DialogDescription>
              Fill in the details for the new responsive reading.
            </DialogDescription>
          </DialogHeader>
          <AddReadingForm onFormSubmit={handleAddReadingSubmit} className="pt-0" />
        </DialogContent>
      </Dialog>

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
              setIsDeleteHymnDialogOpen(false);
              handleDeleteSuccess();
            }}
          />
        </DialogContent>
      </Dialog>

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
              setIsDeleteReadingDialogOpen(false);
              handleDeleteSuccess();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

