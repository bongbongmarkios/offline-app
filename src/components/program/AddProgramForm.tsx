
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createNewProgramAction, type CreateProgramArgs } from '@/app/(main)/program/actions';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronRight, Settings2, ListChecks, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { programItemTitles, type ProgramItemTitle, type ProgramItem } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { initialSampleHymns } from '@/data/hymns';
import { sampleReadings } from '@/data/readings';


interface AddProgramFormProps {
  onFormSubmitSuccess: () => void;
  onCancel: () => void;
}

const defaultSelectedItems: ProgramItemTitle[] = [
  programItemTitles[2], // Opening Hymn
  programItemTitles[3], // Opening Prayer
  programItemTitles[10], // Message
  programItemTitles[12], // Closing Hymn
];

const isHymnItem = (title: ProgramItemTitle): boolean => title.toLowerCase().includes('hymn');
const isReadingItem = (title: ProgramItemTitle): boolean => title.toLowerCase().includes('reading');
const isContentItem = (title: ProgramItemTitle): boolean => !isHymnItem(title) && !isReadingItem(title);

export default function AddProgramForm({ onFormSubmitSuccess, onCancel }: AddProgramFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const [step, setStep] = useState<'details' | 'items' | 'fillDetails'>('details');
  const [selectedItemTitles, setSelectedItemTitles] = useState<ProgramItemTitle[]>(defaultSelectedItems);
  const [programItems, setProgramItems] = useState<Omit<ProgramItem, 'id'>[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const hymns = initialSampleHymns;
  const readings = sampleReadings;

  const handleProceedToItems = () => {
    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a program date.",
        variant: "destructive",
      });
      return;
    }
    setStep('items');
  };

  const handleProceedToFillDetails = () => {
    const itemsToCreate = isCustomizing ? selectedItemTitles : [...programItemTitles];
    if (isCustomizing && itemsToCreate.length === 0) {
      toast({
        title: "Items Required",
        description: "Please select at least one program item.",
        variant: "destructive",
      });
      return;
    }
    setProgramItems(itemsToCreate.map(title => ({ title })));
    setStep('fillDetails');
  };
  
  const handleUpdateProgramItem = (index: number, newDetails: Partial<Omit<ProgramItem, 'id' | 'title'>>) => {
    setProgramItems(currentItems => {
      const newItems = [...currentItems];
      newItems[index] = { ...newItems[index], ...newDetails };
      return newItems;
    });
  };

  const handleFinalSubmit = async () => {
    if (!date) { 
      toast({
        title: "Error",
        description: "Program date is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const programTitleToSubmit = title.trim() === '' ? "Sunday Service" : title.trim();
    
    const programArgs: CreateProgramArgs = {
      title: programTitleToSubmit,
      date: format(date, "yyyy-MM-dd"),
      items: programItems,
    };

    try {
      const result = await createNewProgramAction(programArgs);
      if (result?.success) {
        toast({
          title: "Program Added",
          description: `"${programArgs.title}" has been successfully created.`,
        });
        onFormSubmitSuccess();
        // Reset form for next time
        setTitle('');
        setDate(new Date());
        setSelectedItemTitles(defaultSelectedItems);
        setStep('details');
        setIsCustomizing(false);
      } else {
        throw new Error(result?.error || "Failed to create program.");
      }
    } catch (error: any) {
      console.error("Error creating program:", error);
      toast({
        title: "Error",
        description: error.message || "Could not create program. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step === 'details') handleProceedToItems();
    if (step === 'items') handleProceedToFillDetails();
    if (step === 'fillDetails') handleFinalSubmit();
  };

  const handleSetToday = () => {
    setDate(new Date());
    setIsCalendarOpen(false);
  }

  const handleItemSelection = (itemTitle: ProgramItemTitle, checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setSelectedItemTitles(prev =>
        checked
          ? [...prev, itemTitle]
          : prev.filter(title => title !== itemTitle)
      );
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 py-2 flex flex-col flex-grow min-h-0">
      {step === 'details' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="program-title">Program Title (Optional)</Label>
            <Input
              id="program-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Evening Praise or leave blank for 'Sunday Service'"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program-date">Program Date</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleSetToday}
                disabled={isSubmitting}
                className="flex-grow sm:flex-grow-0"
              >
                Use Today&apos;s Date
              </Button>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "flex-grow justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex-grow"></div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !date}>
              Next: Select Items <ChevronRight className="ml-1 h-4 w-4"/>
            </Button>
          </div>
        </>
      )}

      {step === 'items' && (
        <div className="flex flex-col flex-grow min-h-0 space-y-4">
            <div className="flex-shrink-0">
                 <p className="text-sm text-muted-foreground">Choose which items to include in the program.</p>
            </div>
            <div className="flex justify-between items-center flex-shrink-0">
                <Label className="font-semibold text-md flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-primary"/> Program Items:
                </Label>
                <Button type="button" variant="link" onClick={() => setIsCustomizing(false)} className="text-xs h-auto p-0">
                    Revert to Default
                </Button>
            </div>
            <ScrollArea className="flex-1 w-full rounded-md border p-3">
                <div className="space-y-2">
                {programItemTitles.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                        id={`item-${item.replace(/\s+/g, '-')}`}
                        checked={selectedItemTitles.includes(item)}
                        onCheckedChange={(checked) => handleItemSelection(item, checked)}
                        disabled={isSubmitting}
                    />
                    <Label
                        htmlFor={`item-${item.replace(/\s+/g, '-')}`}
                        className="text-sm font-normal cursor-pointer flex-grow"
                    >
                        {item}
                    </Label>
                    </div>
                ))}
                </div>
            </ScrollArea>
          <div className="flex justify-between gap-2 pt-2 flex-shrink-0">
            <Button type="button" variant="outline" onClick={() => setStep('details')} disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting || selectedItemTitles.length === 0}>
              Next: Fill Details <ChevronRight className="ml-1 h-4 w-4"/>
            </Button>
          </div>
        </div>
      )}

      {step === 'fillDetails' && (
        <div className="flex flex-col flex-grow min-h-0 space-y-4">
            <div className="flex-shrink-0">
                <h3 className="font-semibold">Fill Program Details</h3>
                <p className="text-sm text-muted-foreground">Assign specific content to your selected program items.</p>
            </div>
            <ScrollArea className="flex-1 w-full rounded-md border p-2">
                <div className="space-y-3 p-1">
                {programItems.map((item, index) => (
                    <div key={index} className="p-3 border rounded-md space-y-2 bg-muted/20">
                        <Label className="font-medium text-primary">{item.title}</Label>
                        {isHymnItem(item.title) && (
                            <Select onValueChange={(hymnId) => handleUpdateProgramItem(index, { hymnId: hymnId === 'none' ? undefined : hymnId })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Assign a Hymn..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- No Hymn --</SelectItem>
                                    {hymns.map(hymn => <SelectItem key={hymn.id} value={hymn.id}>{hymn.titleEnglish || hymn.titleHiligaynon}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                        {isReadingItem(item.title) && (
                             <Select onValueChange={(readingId) => handleUpdateProgramItem(index, { readingId: readingId === 'none' ? undefined : readingId })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Assign a Reading..." />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="none">-- No Reading --</SelectItem>
                                    {readings.map(reading => <SelectItem key={reading.id} value={reading.id}>{reading.title}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                         {isContentItem(item.title) && (
                            <Input 
                                placeholder="Add details (e.g., Speaker's Name)" 
                                onChange={(e) => handleUpdateProgramItem(index, { content: e.target.value })} 
                                className="bg-background"
                            />
                         )}
                    </div>
                ))}
                </div>
            </ScrollArea>
            <div className="flex justify-between gap-2 pt-2 flex-shrink-0">
                <Button type="button" variant="outline" onClick={() => setStep('items')} disabled={isSubmitting}>
                   <ChevronLeft className="mr-1 h-4 w-4"/> Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Program'}
                </Button>
            </div>
        </div>
      )}
    </form>
  );
}
