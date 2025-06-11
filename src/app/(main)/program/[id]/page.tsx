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
        title={program.title}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/program">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
            </Link>
          </Button>
        }
      />
      <div className="container mx-auto px-4 pb-8">
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
