
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createNewProgramAction, type CreateProgramArgs } from '@/app/(main)/program/actions';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronRight, ChevronsUpDown, Check, Settings2, ListChecks } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { programItemTitles, type ProgramItemTitle } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

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

export default function AddProgramForm({ onFormSubmitSuccess, onCancel }: AddProgramFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [step, setStep] = useState<'details' | 'items'>('details');
  const [selectedItemTitles, setSelectedItemTitles] = useState<ProgramItemTitle[]>(defaultSelectedItems);

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

  const handleFinalSubmit = async () => {
    if (!date) { 
      toast({
        title: "Error",
        description: "Program date is required.",
        variant: "destructive",
      });
      return;
    }
    if (selectedItemTitles.length === 0) {
      toast({
        title: "Items Required",
        description: "Please select at least one program item.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const programTitleToSubmit = title.trim() === '' ? "Sunday Service" : title.trim();
    
    const programArgs: CreateProgramArgs = {
      title: programTitleToSubmit,
      date: format(date, "yyyy-MM-dd"),
      itemTitles: selectedItemTitles,
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
    if (step === 'items') {
      handleFinalSubmit();
    } else if (step === 'details') {
      handleProceedToItems();
    }
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
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={handleProceedToItems} disabled={isSubmitting || !date}>
              Next: Select Items <ChevronRight className="ml-1 h-4 w-4"/>
            </Button>
          </div>
        </>
      )}

      {step === 'items' && (
        <>
          <div className="space-y-1 mb-3 p-3 border rounded-md bg-muted/50">
            <h3 className="text-sm font-medium text-muted-foreground">Review Details:</h3>
            <p className="text-md font-semibold">{title.trim() === '' ? "Sunday Service" : title.trim()}</p>
            {date && <p className="text-sm text-muted-foreground">{format(date, "PPP")}</p>}
          </div>

          <Label className="font-semibold text-md pt-2 block flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-primary"/> Select Items to Include:
          </Label>
          <p className="text-xs text-muted-foreground -mt-4">
            Common items are selected by default. Adjust as needed.
          </p>

          <ScrollArea className="h-[350px] w-full rounded-md border p-3">
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
          
          <div className="flex justify-between gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setStep('details')} disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting || selectedItemTitles.length === 0}>
              {isSubmitting ? 'Creating...' : 'Create Program'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
