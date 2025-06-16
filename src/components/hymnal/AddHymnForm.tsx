
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
  
  const [author, setAuthor] = useState('');
  const [composer, setComposer] = useState('');
  const [category, setCategory] = useState('');
  
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!titleEnglish || !lyricsEnglish) {
      toast({
        title: "Error",
        description: "English Title and English Lyrics are required.",
        variant: "destructive",
      });
      return;
    }

    console.log('New Hymn:', { 
      titleEnglish, titleFilipino, titleHiligaynon,
      pageNumber, keySignature,
      lyricsEnglish, lyricsFilipino, lyricsHiligaynon,
      author, composer, category 
    });
    toast({
      title: "Hymn Added (Simulated)",
      description: `"${titleEnglish}" has been added to the list (not actually saved).`,
    });

    // Reset all fields
    setTitleEnglish('');
    setTitleFilipino('');
    setTitleHiligaynon('');
    setPageNumber('');
    setKeySignature('');
    setLyricsEnglish('');
    setLyricsFilipino('');
    setLyricsHiligaynon('');
    setAuthor('');
    setComposer('');
    setCategory('');

    if (onFormSubmit) {
      onFormSubmit(); 
    } else {
      router.push('/hymnal'); 
    }
  };

  const handleCancel = () => {
    if (onFormSubmit) {
      onFormSubmit(); // This will typically close the dialog
    } else {
      router.push('/hymnal'); // Navigate if it's the standalone page
    }
  };

  const FormWrapper = onFormSubmit ? 'div' : Card;
  
  const formWrapperFinalClassName = onFormSubmit 
    ? `${className || ''} flex flex-col`
    : `max-w-2xl mx-auto shadow-lg ${className || ''}`;

  const formProps = { className: formWrapperFinalClassName };

  const formElementClassName = onFormSubmit ? "flex flex-col flex-1 min-h-0" : "";
  const cardContentClassName = onFormSubmit ? "pt-4 flex-1 min-h-0 overflow-hidden" : "pt-4"; // This is the element in user's prompt
  const scrollAreaClassName = onFormSubmit ? "h-full w-full" : "max-h-[60vh] w-full";
  const cardFooterClassName = `flex-shrink-0 ${onFormSubmit ? "pt-6" : "pt-6"}`;

  return (
    <FormWrapper {...formProps}>
      {onFormSubmit ? null : ( 
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Hymn</CardTitle>
          <CardDescription>Fill in the details for the new hymn.</CardDescription>
        </CardHeader>
      )}
      <form onSubmit={handleSubmit} className={formElementClassName}>
        <CardContent className={cardContentClassName}>
          <ScrollArea className={scrollAreaClassName}>
            <div className="space-y-6 pr-4 pb-4"> {/* Added pb-4 and pr-4 here */}
              <div className="space-y-2">
                <Label htmlFor="titleEnglish-dialog">Title (English)</Label>
                <Input id="titleEnglish-dialog" value={titleEnglish} onChange={(e) => setTitleEnglish(e.target.value)} placeholder="English Title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleFilipino-dialog">Title (Filipino, Optional)</Label>
                <Input id="titleFilipino-dialog" value={titleFilipino} onChange={(e) => setTitleFilipino(e.target.value)} placeholder="Filipino Title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleHiligaynon-dialog">Title (Hiligaynon, Optional)</Label>
                <Input id="titleHiligaynon-dialog" value={titleHiligaynon} onChange={(e) => setTitleHiligaynon(e.target.value)} placeholder="Hiligaynon Title" />
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
                <Label htmlFor="lyricsEnglish-dialog">Lyrics (English)</Label>
                <Textarea id="lyricsEnglish-dialog" value={lyricsEnglish} onChange={(e) => setLyricsEnglish(e.target.value)} placeholder="Enter English lyrics..." rows={6} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lyricsFilipino-dialog">Lyrics (Filipino, Optional)</Label>
                <Textarea id="lyricsFilipino-dialog" value={lyricsFilipino} onChange={(e) => setLyricsFilipino(e.target.value)} placeholder="Enter Filipino lyrics..." rows={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lyricsHiligaynon-dialog">Lyrics (Hiligaynon, Optional)</Label>
                <Textarea id="lyricsHiligaynon-dialog" value={lyricsHiligaynon} onChange={(e) => setLyricsHiligaynon(e.target.value)} placeholder="Enter Hiligaynon lyrics..." rows={6} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author-dialog">Author (Optional)</Label>
                  <Input id="author-dialog" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., John Newton" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="composer-dialog">Composer (Optional)</Label>
                  <Input id="composer-dialog" value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="e.g., Traditional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-dialog">Category (Optional)</Label>
                  <Input id="category-dialog" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Worship" />
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className={`${cardFooterClassName} flex-col items-stretch gap-2`}> {/* This is the element in user's prompt */}
          <Button type="submit" className="w-full">Add Hymn</Button>
          <Button type="button" variant="outline" onClick={handleCancel} className="w-full">
            Cancel
          </Button>
        </CardFooter>
      </form>
    </FormWrapper>
  );
}
