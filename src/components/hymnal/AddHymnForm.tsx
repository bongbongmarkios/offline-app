
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
import { addSampleHymn } from '@/data/hymns'; // Import the new function
import type { Hymn } from '@/types';

interface AddHymnFormProps {
  onFormSubmit?: () => void;
  className?: string;
}

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
    if (!titleHiligaynon || !lyricsHiligaynon) {
      toast({
        title: "Error",
        description: "Hiligaynon Title and Hiligaynon Lyrics are required.",
        variant: "destructive",
      });
      return;
    }

    // Ensure English title and lyrics have default values if empty, as they are required in the type.
    // The Hymn type expects them for consistency, even if not filled in the form.
    const finalTitleEnglish = titleEnglish || titleHiligaynon; // Default to Hiligaynon if English is empty
    const finalLyricsEnglish = lyricsEnglish || ""; // Default to empty string


    const newHymnData: Omit<Hymn, 'id'> = {
      titleHiligaynon, 
      titleFilipino: titleFilipino || undefined,
      titleEnglish: finalTitleEnglish,
      pageNumber: pageNumber || undefined,
      keySignature: keySignature || undefined,
      lyricsHiligaynon,
      lyricsFilipino: lyricsFilipino || undefined,
      lyricsEnglish: finalLyricsEnglish,
    };
    
    const addedHymn = addSampleHymn(newHymnData);
    console.log('New Hymn Added:', addedHymn);

    toast({
      title: "Hymn Added",
      description: `"${addedHymn.titleEnglish}" has been added to the hymn data.`,
    });

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
    ? `${className || ''} flex flex-col`
    : `max-w-2xl mx-auto shadow-lg ${className || ''}`;

  const formProps = { className: formWrapperFinalClassName };

  const formElementClassName = onFormSubmit ? "flex flex-col flex-1 min-h-0" : "";
  const cardContentClassName = onFormSubmit ? "pt-4 flex-1 min-h-0 overflow-hidden" : "pt-4";
  const scrollAreaClassName = onFormSubmit ? "h-full w-full" : "max-h-[60vh] w-full"; 
  const cardFooterClassName = `flex-shrink-0 ${onFormSubmit ? "pt-6" : "pt-6"}`;

  return (
    <FormWrapper {...formProps}>
      {onFormSubmit ? null : ( 
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Hymn</CardTitle>
          <CardDescription>Fill in the details for the new hymn. Hiligaynon title and lyrics are required.</CardDescription>
        </CardHeader>
      )}
      <form onSubmit={handleSubmit} className={formElementClassName}>
        <CardContent className={cardContentClassName}>
          <ScrollArea className={scrollAreaClassName}>
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
        <CardFooter className={`${cardFooterClassName} flex-col items-stretch gap-2`}>
          <Button type="submit" className="w-full">Add Hymn</Button>
          <Button type="button" variant="outline" onClick={handleCancel} className="w-full">
            Cancel
          </Button>
        </CardFooter>
      </form>
    </FormWrapper>
  );
}
