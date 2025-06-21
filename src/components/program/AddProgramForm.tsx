
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronRight, ListChecks, ChevronLeft, RotateCcw, BookOpenCheck, Music, NotebookText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { programItemTitles, type ProgramItemTitle, type ProgramItem, type Program } from '@/types';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';
import { samplePrograms as initialSamplePrograms } from '@/data/programs';


interface AddProgramFormProps {
  onFormSubmitSuccess: () => void;
  onCancel: () => void;
}

const LOCAL_STORAGE_PROGRAMS_KEY = 'graceNotesPrograms';

const defaultSelectedItems: ProgramItemTitle[] = [
  programItemTitles[2], // Opening Hymn
  programItemTitles[3], // Opening Prayer
  programItemTitles[10], // Message
  programItemTitles[12], // Closing Hymn
];

// Titles that do not require a user-input content field.
const contentlessItemTitles: ProgramItemTitle[] = [
  "Doxology",
  "Rice for Mission offering with children's choir",
  "Pastoral Prayer",
  "Prayer of Benediction",
];

const isHymnItem = (title: ProgramItemTitle): boolean => title.toLowerCase().includes('hymn');
const isReadingItem = (title: ProgramItemTitle): boolean => title.toLowerCase().includes('reading');
// A "content item" is one that is not a hymn, not a reading, and not content-less. It needs an input field.
const isContentItem = (title: ProgramItemTitle): boolean => 
  !isHymnItem(title) && 
  !isReadingItem(title) && 
  !contentlessItemTitles.includes(title);


export default function AddProgramForm({ onFormSubmitSuccess, onCancel }: AddProgramFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const router = useRouter();
  
  const [step, setStep] = useState<'details' | 'items' | 'fillDetails' | 'preview' | 'success'>('details');
  const [selectedItemTitles, setSelectedItemTitles] = useState<ProgramItemTitle[]>(defaultSelectedItems);
  const [programItems, setProgramItems] = useState<Omit<ProgramItem, 'id'>[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false); // Default to NOT customizing
  const [newlyCreatedProgram, setNewlyCreatedProgram] = useState<Program | null>(null);

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
        description: "Please select at least one program item when customizing.",
        variant: "destructive",
      });
      return;
    }
    // Preserve existing details when re-entering this step
    const newProgramItems = itemsToCreate.map(title => {
        const existingItem = programItems.find(p => p.title === title);
        return existingItem || { title };
    });
    setProgramItems(newProgramItems);
    setStep('fillDetails');
  };
  
  const handleUpdateProgramItem = (index: number, newDetails: Partial<Omit<ProgramItem, 'id' | 'title'>>) => {
    setProgramItems(currentItems => {
      const newItems = [...currentItems];
      newItems[index] = { ...newItems[index], ...newDetails };
      return newItems;
    });
  };

  const handleProceedToPreview = () => {
    setStep('preview');
  }

  const resetForm = () => {
    setTitle('');
    setDate(new Date());
    setSelectedItemTitles(defaultSelectedItems);
    setProgramItems([]);
    setIsCustomizing(false);
    setNewlyCreatedProgram(null);
    setStep('details');
  };

  const handleFinalSubmit = () => {
    if (!date) { 
      toast({
        title: "Error",
        description: "Program date is required.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    
    try {
      const programTitleToSubmit = title.trim() === '' ? "Sunday Service" : title.trim();
      
      const storedProgramsString = localStorage.getItem(LOCAL_STORAGE_PROGRAMS_KEY);
      let allPrograms: Program[] = storedProgramsString ? JSON.parse(storedProgramsString) : [...initialSamplePrograms];

      let maxId = 30000;
      allPrograms.forEach(program => {
        const idNum = parseInt(program.id, 10);
        if (!isNaN(idNum) && idNum >= 30000 && idNum < 40000) {
          if (idNum > maxId) maxId = idNum;
        }
      });
      const newId = (maxId + 1).toString();

      let itemCounter = Date.now();
      const finalProgramItems: ProgramItem[] = programItems.map(item => ({
        ...item,
        id: `item-${newId}-${itemCounter++}`,
      }));

      const newProgram: Program = {
        id: newId,
        title: programTitleToSubmit,
        date: format(date, "yyyy-MM-dd"),
        items: finalProgramItems,
      };

      allPrograms.push(newProgram);
      allPrograms.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      localStorage.setItem(LOCAL_STORAGE_PROGRAMS_KEY, JSON.stringify(allPrograms));

      toast({
        title: "Program Added",
        description: `"${newProgram.title}" has been successfully created.`,
      });
      setNewlyCreatedProgram(newProgram);
      setStep('success');
      onFormSubmitSuccess();
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
    if (step === 'fillDetails') handleProceedToPreview();
    if (step === 'preview') handleFinalSubmit();
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
  
  const handleRevertToDefault = () => {
    setIsCustomizing(false);
    setSelectedItemTitles(defaultSelectedItems);
  }

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
                Use Today's Date
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
                 <h3 className="font-semibold">Review Details</h3>
                 <p className="text-sm text-muted-foreground">
                    Title: <span className="font-medium text-foreground">{title.trim() === '' ? "Sunday Service" : title}</span>
                 </p>
                 {date && (
                    <p className="text-sm text-muted-foreground">
                        Date: <span className="font-medium text-foreground">{format(date, "PPP")}</span>
                    </p>
                 )}
            </div>

            <div className="flex-shrink-0">
                <Label className="font-semibold text-md flex items-center">
                    <ListChecks className="mr-2 h-5 w-5 text-primary"/> Program Items
                </Label>
                {!isCustomizing ? (
                    <div className="p-3 mt-2 bg-muted/50 rounded-md border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-sm text-muted-foreground flex-grow">
                            All standard program items will be included by default.
                        </p>
                        <Button type="button" variant="secondary" onClick={() => setIsCustomizing(true)} size="sm" className="flex-shrink-0">
                            Customize Selection
                        </Button>
                    </div>
                ) : (
                     <div className="p-3 mt-2 bg-accent/20 rounded-md text-sm text-accent-foreground border border-accent flex justify-between items-center">
                        <span>Select the items to include below.</span>
                        <Button type="button" variant="link" onClick={handleRevertToDefault} className="text-xs h-auto p-0 text-accent-foreground underline">
                            <RotateCcw className="mr-1 h-3 w-3"/> Revert to Default
                        </Button>
                    </div>
                )}
            </div>

            {isCustomizing && (
                <ScrollArea className="flex-1 w-full rounded-md border p-3 min-h-0">
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
            )}
            
            {!isCustomizing && <div className="flex-grow"></div>}

            <div className="flex justify-between gap-2 pt-2 flex-shrink-0">
                <Button type="button" variant="outline" onClick={() => setStep('details')} disabled={isSubmitting}>
                   <ChevronLeft className="mr-1 h-4 w-4"/> Back
                </Button>
                <Button type="submit" disabled={isSubmitting || (isCustomizing && selectedItemTitles.length === 0)}>
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
            <ScrollArea className="flex-1 w-full rounded-md border p-2 min-h-0">
                <div className="space-y-3 p-1">
                {programItems.map((item, index) => (
                    <div key={index} className="p-3 border rounded-md space-y-2 bg-muted/20">
                        <Label className="font-medium text-primary">{item.title}</Label>
                        {isHymnItem(item.title) && (
                            <Select onValueChange={(hymnId) => handleUpdateProgramItem(index, { hymnId: hymnId === 'none' ? undefined : hymnId })} value={item.hymnId}>
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
                             <Select onValueChange={(readingId) => handleUpdateProgramItem(index, { readingId: readingId === 'none' ? undefined : readingId })} value={item.readingId}>
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
                                defaultValue={item.content || ''}
                            />
                         )}
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={`item-notes-${index}`} className="border-b-0">
                                <AccordionTrigger className="text-sm py-2 hover:no-underline [&[data-state=open]>svg]:text-primary flex items-center gap-2 text-muted-foreground hover:text-accent-foreground">
                                    <NotebookText className="h-4 w-4"/>
                                    <span>{item.notes && item.notes.trim() !== '' ? 'Edit Note' : 'Add Note'}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Textarea
                                        placeholder="Add optional notes for this item..."
                                        onChange={(e) => handleUpdateProgramItem(index, { notes: e.target.value })}
                                        className="bg-background text-sm"
                                        rows={3}
                                        defaultValue={item.notes || ''}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                ))}
                </div>
            </ScrollArea>
            <div className="flex justify-between gap-2 pt-2 flex-shrink-0">
                <Button type="button" variant="outline" onClick={() => setStep('items')} disabled={isSubmitting}>
                   <ChevronLeft className="mr-1 h-4 w-4"/> Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    Next: Preview Program <ChevronRight className="ml-1 h-4 w-4"/>
                </Button>
            </div>
        </div>
      )}

      {step === 'preview' && (
        <div className="flex flex-col flex-grow min-h-0 space-y-4">
          <div className="flex-shrink-0">
            <h3 className="font-semibold">Preview Program</h3>
            <p className="text-sm text-muted-foreground">Review the program details below before creating.</p>
             <div className="mt-2 text-sm">
                <p><strong>Title:</strong> {title.trim() === '' ? "Sunday Service" : title}</p>
                {date && <p><strong>Date:</strong> {format(date, "PPP")}</p>}
            </div>
          </div>
          <ScrollArea className="flex-1 w-full rounded-md border p-2 min-h-0">
            <div className="space-y-3 p-1">
              {programItems.map((item, index) => {
                  const hymn = item.hymnId ? hymns.find(h => h.id === item.hymnId) : null;
                  const reading = item.readingId ? readings.find(r => r.id === item.readingId) : null;
                  return (
                    <div key={index} className="p-3 border rounded-md space-y-1 bg-muted/20">
                        <p className="font-medium text-primary">{index + 1}. {item.title}</p>
                        {hymn && (
                            <div className="pl-4 text-sm text-muted-foreground flex items-center">
                                <Music className="mr-2 h-4 w-4"/>
                                <span>{hymn.titleEnglish || hymn.titleHiligaynon}</span>
                            </div>
                        )}
                        {reading && (
                             <div className="pl-4 text-sm text-muted-foreground flex items-center">
                                <BookOpenCheck className="mr-2 h-4 w-4"/>
                                <span>{reading.title}</span>
                            </div>
                        )}
                         {item.content && (
                           <div className="pl-4 text-sm text-muted-foreground">
                                <span className="italic">{item.content}</span>
                           </div>
                         )}
                         {item.notes && (
                            <div className="pl-4 text-sm text-muted-foreground flex items-start gap-2 mt-2 pt-2 border-t border-dashed">
                                <NotebookText className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-foreground">Note: </span>
                                    <span className="italic whitespace-pre-wrap">{item.notes}</span>
                                </div>
                            </div>
                        )}
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
          <div className="flex justify-between gap-2 pt-2 flex-shrink-0">
            <Button type="button" variant="outline" onClick={() => setStep('fillDetails')} disabled={isSubmitting}>
              <ChevronLeft className="mr-1 h-4 w-4"/> Back to Edit
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Program'}
            </Button>
          </div>
        </div>
      )}

      {step === 'success' && newlyCreatedProgram && (
        <div className="flex flex-col flex-grow min-h-0">
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold">Program Created!</h3>
                <p className="text-muted-foreground mt-2">
                    "{newlyCreatedProgram.title}" is now ready.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 flex-shrink-0">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        onCancel(); // Closes the dialog
                        resetForm();
                    }}
                >
                    Add to List
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        onCancel(); // Closes the dialog
                        router.push(`/program/${newlyCreatedProgram.id}`);
                        resetForm();
                    }}
                >
                    Start Presentation <ChevronRight className="ml-1 h-4 w-4"/>
                </Button>
            </div>
        </div>
      )}
    </form>
  );
}
