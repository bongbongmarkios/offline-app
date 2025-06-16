
'use client';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

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

    // Reset form fields
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

  // Use Card for page context, but not necessarily for dialog context
  // The parent component (dialog or page) can decide on the wrapper.
  // For now, we'll use a simple div and allow styling via className.
  const FormWrapper = onFormSubmit ? 'div' : Card;
  const formProps = onFormSubmit ? { className: className } : { className: `max-w-2xl mx-auto shadow-lg ${className || ''}` };


  return (
    <FormWrapper {...formProps}>
      {onFormSubmit ? null : ( // Only render CardHeader if not in dialog (or parent handles header)
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Hymn</CardTitle>
          <CardDescription>Fill in the details for the new hymn.</CardDescription>
        </CardHeader>
      )}
      <form onSubmit={handleSubmit}>
        <CardContent className={onFormSubmit ? "pt-4 space-y-6" : "space-y-6"}> {/* Adjust padding if in dialog */}
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
        </CardContent>
        <CardFooter className={onFormSubmit ? "pt-4" : ""}> {/* Adjust padding if in dialog */}
          <Button type="submit" className="w-full md:w-auto">Add Hymn</Button>
        </CardFooter>
      </form>
    </FormWrapper>
  );
}
