import AppHeader from '@/components/layout/AppHeader';
import ProgramList from '@/components/program/ProgramList';
import { samplePrograms } from '@/data/programs';

export default async function ProgramListPage() {
  const programs = samplePrograms;

  return (
    <>
      <AppHeader title="Programs" />
      <div className="container mx-auto px-4 pb-8">
        <ProgramList programs={programs} />
      </div>
    </>
  );
}
