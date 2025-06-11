
'use client';
import type { Program } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

interface ProgramListProps {
  programs: Program[];
}

export default function ProgramList({ programs }: ProgramListProps) {
  if (!programs || programs.length === 0) {
    return <p className="text-muted-foreground">No programs available.</p>;
  }

  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <Link key={program.id} href={`/program/${program.id}`} className="block hover:no-underline">
          <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer hover:border-primary/50">
            <CardHeader>
              <CardTitle className="font-headline text-xl group-hover:text-primary">{program.title}</CardTitle>
              {program.date && (
                <CardDescription className="text-sm text-muted-foreground pt-1 flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {new Date(program.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
