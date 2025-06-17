
import AppHeader from '@/components/layout/AppHeader';

export const metadata = {
  title: 'Blank Page | GraceNotes',
};

export default function BlankPage() {
  return (
    <>
      <AppHeader title="Blank Page" />
      <div className="container mx-auto px-4 pb-8">
        <p className="text-center text-muted-foreground mt-10">This is a blank page.</p>
      </div>
    </>
  );
}
