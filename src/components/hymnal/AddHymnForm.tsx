'use client';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

// In a real app, this would interact with a backend or more robust state management.
// For now, it's a local form demonstration.

export default function AddHymnForm() {
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
    // Basic validation
    if (!title || !lyrics) {
      toast({
        title: "Error",
        description: "Title and Lyrics are required.",
        variant: "destructive",
      });
      return;
    }

    console.log('New Hymn:', { title, number, lyrics, author, composer, category });
    // Here you would typically send data to an API or update global state.
    // For this example, we'll just show a success toast and redirect.
    toast({
      title: "Hymn Added (Simulated)",
      description: `"${title}" has been added to the list (not actually saved).`,
    });
    router.push('/hymnal'); 
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Add New Hymn</CardTitle>
        <CardDescription>Fill in the details for the new hymn.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Amazing Grace" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Number (Optional)</Label>
              <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g., 202" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Worship" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lyrics">Lyrics</Label>
            <Textarea id="lyrics" value={lyrics} onChange={(e) => setLyrics(e.target.value)} placeholder="Enter hymn lyrics here..." rows={10} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author (Optional)</Label>
              <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g., John Newton" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="composer">Composer (Optional)</Label>
              <Input id="composer" value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="e.g., Traditional" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full md:w-auto">Add Hymn</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
