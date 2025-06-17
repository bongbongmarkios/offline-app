
'use client';

import { useState } from 'react';
import type { Hymn } from '@/types';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import HymnMultiLanguageView from './HymnMultiLanguageView';

interface HymnMultiLanguageDialogProps {
  hymn: Hymn;
  pageNumberExists: boolean;
}

export default function HymnMultiLanguageDialog({ hymn, pageNumberExists }: HymnMultiLanguageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!pageNumberExists) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="View in all languages">
          <Globe className="h-6 w-6 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Hymn Translations: {hymn.titleEnglish || hymn.titleHiligaynon}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow mt-4 mb-0 pr-2">
          <HymnMultiLanguageView hymn={hymn} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
