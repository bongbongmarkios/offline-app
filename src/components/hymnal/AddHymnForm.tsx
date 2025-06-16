
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
  onFormSubmit?: () => void; // Optional callback for when form is submitted successfully
  className?: string; // Allow passing a class name for layout adjustments if needed
}

export default function AddHymnForm({ onFormSubmit, className }: AddHymnFormProps) {
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [author, setAuthor] = useState('');
  const [composer, setComposer] = useState('');
  const [category, setCategory] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !lyrics) {
      toast({
        title: "Error",
        description: "Title and Lyrics are required.",
        variant: "destructive",
      });
      return;
    }

    console.log('New Hymn:', { title, number, lyrics, author, composer, category });
    toast({
      title: "Hymn Added (Simulated)",
      description: `"${title}" has been added to the list (not actually saved).`,
    });

    setTitle('');
    setNumber('');
    setLyrics('');
    setAuthor('');
    setComposer('');
    setCategory('');

    if (onFormSubmit) {
      onFormSubmit(); 
    } else {
      router.push('/hymnal'); 
    }
  };

  const FormWrapper = onFormSubmit ? 'div' : Card;
  
  const formWrapperFinalClassName = onFormSubmit 
    ? `${className} flex flex-col` // For dialog, make the wrapper a flex column
    : `max-w-2xl mx-auto shadow-lg ${className || ''}`; // For page

  const formProps = { className: formWrapperFinalClassName };

  const formElementClassName = onFormSubmit ? "flex flex-col flex-1 min-h-0" : "";
  const cardContentClassName = onFormSubmit ? "pt-4 flex-1 min-h-0 overflow-hidden" : "";
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
            <div className="space-y-6 pr-4 pb-4">
              <div className="space-y-2">
                <Label htmlFor="title-dialog">Title</Label>
                <Input id="title-dialog" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Amazing Grace" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number-dialog">Number (Optional)</Label>
                  <Input id="number-dialog" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g., 202" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-dialog">Category (Optional)</Label>
                  <Input id="category-dialog" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Worship" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lyrics-dialog">Lyrics</Label>
                <Textarea id="lyrics-dialog" value={lyrics} onChange={(e) => setLyrics(e.target.value)} placeholder="Enter hymn lyrics here..." rows={8} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author-dialog">Author (Optional)</Label>
                  <Input id="author-dialog" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., John Newton" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="composer-dialog">Composer (Optional)</Label>
                  <Input id="composer-dialog" value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="e.g., Traditional" />
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className={cardFooterClassName}>
          <Button type="submit" className="w-full md:w-auto">Add Hymn</Button>
        </CardFooter>
      </form>
    </FormWrapper>
  );
}
