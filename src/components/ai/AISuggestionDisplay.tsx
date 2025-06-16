
'use client';

import { useEffect, useState } from 'react';
import { useActivity } from '@/hooks/useActivityTracker';
import { suggestRelatedContent, type SuggestRelatedContentOutput } from '@/ai/flows/suggest-related-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, Wand2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { sampleHymns } from '@/data/hymns';
import { sampleReadings } from '@/data/readings';

export default function AISuggestionDisplay() {
  const activity = useActivity();
  const [suggestions, setSuggestions] = useState<SuggestRelatedContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activity.recentHymns.length === 0 && activity.recentReadings.length === 0 && activity.recentProgramItems.length === 0) {
        setSuggestions(null); // No activity, no suggestions.
        setIsLoading(false);
        return;
      }
      const result = await suggestRelatedContent({
        recentHymns: activity.recentHymns, // These are English titles from useActivity
        recentReadings: activity.recentReadings,
        recentProgramItems: activity.recentProgramItems,
      });
      setSuggestions(result);
    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
      setError("Failed to load suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.recentHymns, activity.recentReadings, activity.recentProgramItems]); // Re-fetch when activity changes

  // Finds item by English title for hymns, or original title for readings
  const findItemId = (title: string, type: 'hymn' | 'reading') => {
    if (type === 'hymn') {
      const hymn = sampleHymns.find(h => h.titleEnglish === title);
      return hymn ? `/hymnal/${hymn.id}` : null;
    }
    const reading = sampleReadings.find(r => r.title === title);
    return reading ? `/readings/${reading.id}` : null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Generating insightful suggestions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center"><AlertTriangle className="mr-2" />Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter>
            <Button onClick={fetchSuggestions} variant="destructive">
                <RefreshCw className="mr-2 h-4 w-4"/> Try Again
            </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!suggestions || (suggestions.suggestedHymns.length === 0 && suggestions.suggestedReadings.length === 0)) {
     if (activity.recentHymns.length === 0 && activity.recentReadings.length === 0 && activity.recentProgramItems.length === 0) {
        return (
             <div className="text-center p-8 min-h-[300px] flex flex-col items-center justify-center">
                <Wand2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Discover Related Content</h3>
                <p className="text-muted-foreground max-w-md">
                As you explore hymns, readings, and programs, we'll provide personalized suggestions here to enrich your experience.
                </p>
            </div>
        );
     }
    return (
        <div className="text-center p-8 min-h-[300px] flex flex-col items-center justify-center">
            <Wand2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Suggestions Yet</h3>
            <p className="text-muted-foreground max-w-md">
            Based on your recent activity, we couldn't find specific suggestions right now. Keep exploring, and check back soon!
            </p>
            <Button onClick={fetchSuggestions} variant="outline" className="mt-6">
                <RefreshCw className="mr-2 h-4 w-4"/> Refresh Suggestions
            </Button>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
            <Wand2 className="mr-3 h-7 w-7 text-primary"/> Content Suggestions
        </CardTitle>
        {suggestions.reasoning && (
          <CardDescription className="pt-1">{suggestions.reasoning}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {suggestions.suggestedHymns.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-primary/90">Suggested Hymns</h3>
            <ul className="space-y-2">
              {suggestions.suggestedHymns.map((hymnTitle) => { // This title is expected to be English
                const path = findItemId(hymnTitle, 'hymn');
                return (
                  <li key={hymnTitle} className="p-3 bg-primary/5 rounded-md hover:bg-primary/10 transition-colors">
                    {path ? (
                      <Link href={path} className="font-medium text-accent hover:underline">
                        {hymnTitle}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">{hymnTitle}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {suggestions.suggestedReadings.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-primary/90">Suggested Readings</h3>
            <ul className="space-y-2">
              {suggestions.suggestedReadings.map((readingTitle) => {
                 const path = findItemId(readingTitle, 'reading');
                return (
                  <li key={readingTitle} className="p-3 bg-primary/5 rounded-md hover:bg-primary/10 transition-colors">
                     {path ? (
                      <Link href={path} className="font-medium text-accent hover:underline">
                        {readingTitle}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">{readingTitle}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
       <CardFooter className="flex-col items-start gap-2">
            <Button onClick={fetchSuggestions} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4"/> Refresh Suggestions
            </Button>
            { (activity.recentHymns.length > 0 || activity.recentReadings.length > 0 || activity.recentProgramItems.length > 0) &&
                <Button onClick={activity.clearActivity} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive">
                    Clear Activity History
                </Button>
            }
      </CardFooter>
    </Card>
  );
}
