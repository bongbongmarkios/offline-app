import AppHeader from '@/components/layout/AppHeader';
import ProgramPresenter from '@/components/program/ProgramPresenter';
import { samplePrograms } from '@/data/programs';
import type { Program } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {notFound} from 'next/navigation';


interface ProgramPageProps {
  params: { id: string };
}

async function getProgram(id: string): Promise<Program | undefined> {
  return samplePrograms.find((p) => p.id === id);
}

export async function generateMetadata({ params }: ProgramPageProps) {
  const program = await getProgram(params.id);
  if (!program) {
    return { title: 'Program Not Found' };
  }
  return { title: program.title };
}


export default async function ProgramPage({ params }: ProgramPageProps) {
  const program = await getProgram(params.id);

  if (!program) {
    notFound();
  }

  return (
    <>
      <AppHeader 
        title=""
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/program">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
            </Link>
          </Button>
        }
      />
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center my-4 md:my-6">
          <h1 className="text-xl md:text-2xl font-headline font-bold text-primary break-words">
            {program.title}
          </h1>
          {program.date && (
            <p className="text-md md:text-lg text-muted-foreground mt-2">
              {new Date(program.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
        <ProgramPresenter program={program} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return samplePrograms.map(program => ({
    id: program.id,
  }));
}
