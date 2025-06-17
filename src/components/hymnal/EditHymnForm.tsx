
'use client';
import { useState, type FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { updateSampleHymn } from '@/data/hymns';
import type { Hymn } from '@/types';
import { CardContent, CardFooter } from '@/components/ui/card'; // Re-added for dialog structure

interface EditHymnFormProps {
  hymnToEdit: Hymn;
  onEditSuccess: () => void;
  onCancel: () => void;
  className?: string;
}

export default function EditHymnForm({ hymnToEdit, onEditSuccess, onCancel, className }: EditHymnFormProps) {
  const [pageNumber, setPageNumber] = useState(hymnToEdit.pageNumber || '');
  const [keySignature, setKeySignature] = useState(hymnToEdit.keySignature || '');
  
  const [titleEnglish, setTitleEnglish] = useState(hymnToEdit.titleEnglish || '');
  const [titleFilipino, setTitleFilipino] = useState(hymnToEdit.titleFilipino || '');
  const [titleHiligaynon, setTitleHiligaynon] = useState(hymnToEdit.titleHiligaynon || '');
  
  const [lyricsEnglish, setLyricsEnglish] = useState(hymnToEdit.lyricsEnglish || '');
  const [lyricsFilipino, setLyricsFilipino] = useState(hymnToEdit.lyricsFilipino || '');
  const [lyricsHiligaynon, setLyricsHiligaynon] = useState(hymnToEdit.lyricsHiligaynon || '');
  
  const { toast } = useToast();

  // Effect to update form fields if hymnToEdit prop changes (e.g., if dialog is reused without remounting)
  useEffect(() => {
    setPageNumber(hymnToEdit.pageNumber || '');
    setKeySignature(hymnToEdit.keySignature || '');
    setTitleEnglish(hymnToEdit.titleEnglish || '');
    setTitleFilipino(hymnToEdit.titleFilipino || '');
    setTitleHiligaynon(hymnToEdit.titleHiligaynon || '');
    setLyricsEnglish(hymnToEdit.lyricsEnglish || '');
    setLyricsFilipino(hymnToEdit.lyricsFilipino || '');
    setLyricsHiligaynon(hymnToEdit.lyricsHiligaynon || '');
  }, [hymnToEdit]);

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

    // Ensure English title and lyrics have default values if empty
    const finalTitleEnglish = titleEnglish || titleHiligaynon;
    const finalLyricsEnglish = lyricsEnglish || "";

    const updatedHymnData: Partial<Omit<Hymn, 'id'>> = {
      titleHiligaynon, 
      titleFilipino: titleFilipino || undefined,
      titleEnglish: finalTitleEnglish,
      pageNumber: pageNumber || undefined,
      keySignature: keySignature || undefined,
      lyricsHiligaynon,
      lyricsFilipino: lyricsFilipino || undefined,
      lyricsEnglish: finalLyricsEnglish,
    };
    
    const updatedHymn = updateSampleHymn(hymnToEdit.id, updatedHymnData);

    if (updatedHymn) {
      toast({
        title: "Hymn Updated",
        description: `"${updatedHymn.titleEnglish || updatedHymn.titleHiligaynon}" has been updated.`,
      });
      onEditSuccess();
    } else {
      toast({
        title: "Error",
        description: "Failed to update hymn.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${className || ''} flex flex-col`}>
      <CardContent className="pt-4 flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="space-y-6 pr-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="edit-titleHiligaynon">Title (Hiligaynon)</Label>
              <Input 
                id="edit-titleHiligaynon" 
                value={titleHiligaynon} 
                onChange={(e) => setTitleHiligaynon(e.target.value.toUpperCase())} 
                placeholder="Hiligaynon Title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-titleFilipino">Title (Filipino, Optional)</Label>
              <Input id="edit-titleFilipino" value={titleFilipino} onChange={(e) => setTitleFilipino(e.target.value)} placeholder="Filipino Title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-titleEnglish">Title (English, Optional)</Label>
              <Input id="edit-titleEnglish" value={titleEnglish} onChange={(e) => setTitleEnglish(e.target.value)} placeholder="English Title" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pageNumber">Page Number (Optional)</Label>
                <Input id="edit-pageNumber" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} placeholder="e.g., 123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-keySignature">Key Signature (Optional)</Label>
                <Input id="edit-keySignature" value={keySignature} onChange={(e) => setKeySignature(e.target.value)} placeholder="e.g., C Major" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-lyricsHiligaynon">Lyrics (Hiligaynon)</Label>
              <Textarea id="edit-lyricsHiligaynon" value={lyricsHiligaynon} onChange={(e) => setLyricsHiligaynon(e.target.value)} placeholder="Enter Hiligaynon lyrics..." rows={6} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lyricsFilipino">Lyrics (Filipino, Optional)</Label>
              <Textarea id="edit-lyricsFilipino" value={lyricsFilipino} onChange={(e) => setLyricsFilipino(e.target.value)} placeholder="Enter Filipino lyrics..." rows={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lyricsEnglish">Lyrics (English, Optional)</Label>
              <Textarea id="edit-lyricsEnglish" value={lyricsEnglish} onChange={(e) => setLyricsEnglish(e.target.value)} placeholder="Enter English lyrics..." rows={6} />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-6 flex-shrink-0 flex-col items-stretch gap-2">
        <Button type="submit" className="w-full">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </CardFooter>
    </form>
  );
}
