
'use client';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addSampleHymn, initialSampleHymns } from '@/data/hymns'; 
import type { Hymn } from '@/types';
import { cn } from '@/lib/utils';

interface AddHymnFormProps {
  onFormSubmit?: () => void;
  className?: string;
}

const LOCAL_STORAGE_HYMNS_KEY = 'graceNotesHymns';

export default function AddHymnForm({ onFormSubmit, className }: AddHymnFormProps) {
  const [pageNumber, setPageNumber] = useState('');
  const [keySignature, setKeySignature] = useState('');
  
  const [titleEnglish, setTitleEnglish] = useState('');
  const [titleFilipino, setTitleFilipino] = useState('');
  const [titleHiligaynon, setTitleHiligaynon] = useState('');
  
  const [lyricsEnglish, setLyricsEnglish] = useState('');
  const [lyricsFilipino, setLyricsFilipino] = useState('');
  const [lyricsHiligaynon, setLyricsHiligaynon] = useState('');
  
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!titleHiligaynon.trim() || !lyricsHiligaynon.trim()) {
      toast({
        title: "Error",
        description: "Hiligaynon Title and Hiligaynon Lyrics are required and cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const newHymnData: Omit<Hymn, 'id'> = {
      titleHiligaynon: titleHiligaynon.trim(),
      titleFilipino: titleFilipino.trim() || undefined,
      titleEnglish: titleEnglish.trim() || titleHiligaynon.trim(), // Fallback to Hiligaynon title if English is empty
      
      lyricsHiligaynon: lyricsHiligaynon, // Preserve original spacing, required to be non-empty by check above
      lyricsFilipino: titleFilipino.trim() ? lyricsFilipino : undefined, // Save lyricsFilipino (can be "") if titleFilipino exists
      lyricsEnglish: lyricsEnglish, // Save as is (can be "" if lyricsEnglish field is empty)

      pageNumber: pageNumber.trim() || undefined,
      keySignature: keySignature.trim() || undefined,
      externalUrl: undefined, // Not editable in this form
    };
    
    const addedHymn = addSampleHymn(newHymnData);

    try {
      const storedHymnsString = localStorage.getItem(LOCAL_STORAGE_HYMNS_KEY);
      let allHymnsForStorage: Hymn[];

      if (storedHymnsString) {
        try {
          allHymnsForStorage = JSON.parse(storedHymnsString);
          allHymnsForStorage = allHymnsForStorage.filter(h => h.id !== addedHymn.id);
          allHymnsForStorage.push(addedHymn);
        } catch (parseError) {
          console.error("Error parsing hymns from localStorage, re-initializing with current data:", parseError);
          allHymnsForStorage = [...initialSampleHymns]; 
        }
      } else {
        allHymnsForStorage = [...initialSampleHymns];
      }
      
      allHymnsForStorage.sort((a, b) => {
        const pageNumA = a.pageNumber ? parseInt(a.pageNumber, 10) : Infinity;
        const pageNumB = b.pageNumber ? parseInt(b.pageNumber, 10) : Infinity;
        if (isNaN(pageNumA) && isNaN(pageNumB)) return 0;
        if (isNaN(pageNumA)) return 1;
        if (isNaN(pageNumB)) return -1;
        return pageNumA - pageNumB;
      });

      localStorage.setItem(LOCAL_STORAGE_HYMNS_KEY, JSON.stringify(allHymnsForStorage));
      
    } catch (error) {
      console.error("Error saving hymn to localStorage:", error);
      toast({
        title: 'Storage Error',
        description: 'Could not save hymn to local storage. It is added for this session only.',
        variant: 'destructive',
      });
    }

    toast({
      title: "Hymn Added",
      description: `"${addedHymn.titleEnglish || addedHymn.titleHiligaynon}" has been added.`,
    });

    // Reset form fields
    setTitleHiligaynon('');
    setTitleFilipino('');
    setTitleEnglish('');
    setPageNumber('');
    setKeySignature('');
    setLyricsHiligaynon('');
    setLyricsFilipino('');
    setLyricsEnglish('');

    if (onFormSubmit) {
      onFormSubmit(); 
    } else {
      router.push('/hymnal'); 
      router.refresh(); 
    }
  };

  const handleCancel = () => {
    setTitleHiligaynon('');
    setTitleFilipino('');
    setTitleEnglish('');
    setPageNumber('');
    setKeySignature('');
    setLyricsHiligaynon('');
    setLyricsFilipino('');
    setLyricsEnglish('');
    
    if (onFormSubmit) {
      onFormSubmit(); 
    } else {
      router.push('/hymnal'); 
    }
  };

  const FormWrapper = onFormSubmit ? 'div' : Card;
  
  const formWrapperFinalClassName = onFormSubmit 
    ? cn(className, 'flex flex-col') // In dialog, AddHymnForm's root div is a flex column
    : cn('max-w-2xl mx-auto shadow-lg', className); // Standalone page

  const formElementBaseClasses = "flex flex-col";
  const formElementConditionalClasses = onFormSubmit ? "flex-1 min-h-0" : ""; // Form grows if in dialog
  const formElementFinalClassName = cn(formElementBaseClasses, formElementConditionalClasses);

  const cardContentBaseClasses = "pt-4 flex-1 min-h-0 overflow-hidden"; // Content area always grows and handles internal scroll
  const cardContentConditionalClasses = !onFormSubmit ? "max-h-[60vh]" : ""; // Limit height in standalone page mode
  const cardContentFinalClassName = cn(cardContentBaseClasses, cardContentConditionalClasses);
  
  const scrollAreaFinalClassName = "h-full w-full"; // ScrollArea always fills its parent (CardContent)

  const cardFooterBaseClasses = "flex-shrink-0 flex-col items-stretch gap-2";
  const cardFooterConditionalClasses = onFormSubmit ? "pt-6" : "pt-6"; // Keep original padding logic
  const cardFooterFinalClassName = cn(cardFooterBaseClasses, cardFooterConditionalClasses);


  return (
    <FormWrapper {...(onFormSubmit ? {className: formWrapperFinalClassName} : {className: formWrapperFinalClassName})}>
      {onFormSubmit ? null : ( 
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Hymn</CardTitle>
          <CardDescription>Fill in the details for the new hymn. Hiligaynon title and lyrics are required.</CardDescription>
        </CardHeader>
      )}
      <form onSubmit={handleSubmit} className={formElementFinalClassName}>
        <CardContent className={cardContentFinalClassName}>
          <ScrollArea className={scrollAreaFinalClassName}>
            <div className="space-y-6 pr-4 pb-4">
              <div className="space-y-2">
                <Label htmlFor="titleHiligaynon-dialog">Title (Hiligaynon)</Label>
                <Input 
                  id="titleHiligaynon-dialog" 
                  value={titleHiligaynon} 
                  onChange={(e) => setTitleHiligaynon(e.target.value.toUpperCase())} 
                  placeholder="Hiligaynon Title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleFilipino-dialog">Title (Filipino, Optional)</Label>
                <Input id="titleFilipino-dialog" value={titleFilipino} onChange={(e) => setTitleFilipino(e.target.value)} placeholder="Filipino Title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEnglish-dialog">Title (English, Optional)</Label>
                <Input id="titleEnglish-dialog" value={titleEnglish} onChange={(e) => setTitleEnglish(e.target.value)} placeholder="English Title" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pageNumber-dialog">Page Number (Optional)</Label>
                  <Input id="pageNumber-dialog" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} placeholder="e.g., 123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keySignature-dialog">Key Signature (Optional)</Label>
                  <Input id="keySignature-dialog" value={keySignature} onChange={(e) => setKeySignature(e.target.value)} placeholder="e.g., C Major" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lyricsHiligaynon-dialog">Lyrics (Hiligaynon)</Label>
                <Textarea id="lyricsHiligaynon-dialog" value={lyricsHiligaynon} onChange={(e) => setLyricsHiligaynon(e.target.value)} placeholder="Enter Hiligaynon lyrics..." rows={6} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lyricsFilipino-dialog">Lyrics (Filipino, Optional)</Label>
                <Textarea id="lyricsFilipino-dialog" value={lyricsFilipino} onChange={(e) => setLyricsFilipino(e.target.value)} placeholder="Enter Filipino lyrics..." rows={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lyricsEnglish-dialog">Lyrics (English, Optional)</Label>
                <Textarea id="lyricsEnglish-dialog" value={lyricsEnglish} onChange={(e) => setLyricsEnglish(e.target.value)} placeholder="Enter English lyrics..." rows={6} />
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className={cardFooterFinalClassName}>
          <Button type="submit" className="w-full">Add Hymn</Button>
          <Button type="button" variant="outline" onClick={handleCancel} className="w-full">
            Cancel
          </Button>
        </CardFooter>
      </form>
    </FormWrapper>
  );
}

    