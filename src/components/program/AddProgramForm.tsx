
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createNewProgramAction, type CreateProgramArgs } from '@/app/(main)/program/actions';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddProgramFormProps {
  onFormSubmitSuccess: () => void;
  onCancel: () => void;
}

export default function AddProgramForm({ onFormSubmitSuccess, onCancel }: AddProgramFormProps) {
  const [title, setTitle] = useState(''); // Initial title is now empty
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date) { // Only date is strictly required now
      toast({
        title: "Error",
        description: "Program date is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Default title to formatted date if user leaves it blank
    const programTitleToSubmit = title.trim() === '' ? format(date, "MMMM d, yyyy") : title.trim();

    const programArgs: CreateProgramArgs = {
      title: programTitleToSubmit,
      date: format(date, "yyyy-MM-dd"), // Format date to YYYY-MM-DD string
    };

    try {
      const result = await createNewProgramAction(programArgs);
      if (result?.success) {
        toast({
          title: "Program Added",
          description: `"${programArgs.title}" has been successfully created.`,
        });
        onFormSubmitSuccess(); // Close dialog and refresh list
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="program-title">Program Title (Optional)</Label>
        <Input
          id="program-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Sunday Worship Service or leave blank for date"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="program-date">Program Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
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
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !date}>
          {isSubmitting ? 'Creating...' : 'Create Program'}
        </Button>
      </div>
    </form>
  );
}
