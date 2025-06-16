
'use client';
import type { ReactNode } from 'react';
import { Menu, PlusCircle, Trash2, Info, Settings as SettingsIcon, BookPlus, BookX, Wand2 } from 'lucide-react';
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
  // DialogTrigger, // Not needed if triggered from DropdownMenuItem onSelect
} from "@/components/ui/dialog";
import { useState } from 'react';
import AddHymnForm from '@/components/hymnal/AddHymnForm';
import AddReadingForm from '@/components/readings/AddReadingForm'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AppHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function AppHeader({ title, actions }: AppHeaderProps) {
  const [isAddHymnDialogOpen, setIsAddHymnDialogOpen] = useState(false);
  const [isAddReadingDialogOpen, setIsAddReadingDialogOpen] = useState(false);
  const router = useRouter();

  const handleAddHymnSubmit = () => {
    setIsAddHymnDialogOpen(false);
    // Potentially refresh data or navigate if needed, but AddHymnForm handles navigation for now
  };

  const handleAddReadingSubmit = () => {
    setIsAddReadingDialogOpen(false);
    // Potentially refresh data or navigate
  };

  return (
    <>
      <header className="bg-card shadow-sm mb-4 md:mb-6 print:hidden">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-headline font-semibold text-primary sm:text-3xl">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <Button asChild variant="ghost" size="icon" aria-label="AI Suggestions">
              <Link href="/suggestions">
                <Wand2 className="h-6 w-6" />
              </Link>
            </Button>
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
                  onSelect={() => {
                    console.log('Delete Hymn clicked');
                    // Potentially open a confirmation dialog or navigate to a delete page
                  }}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Hymn</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    console.log('Delete Reading clicked');
                     // Potentially open a confirmation dialog or navigate to a delete page
                  }}
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
          </div>
        </div>
      </header>

      {/* Add Hymn Dialog */}
      <Dialog open={isAddHymnDialogOpen} onOpenChange={setIsAddHymnDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Hymn</DialogTitle>
            <DialogDescription>
              Fill in the details for the new hymn. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <AddHymnForm onFormSubmit={handleAddHymnSubmit} className="pt-0" />
        </DialogContent>
      </Dialog>

      {/* Add Reading Dialog */}
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
    </>
  );
}
