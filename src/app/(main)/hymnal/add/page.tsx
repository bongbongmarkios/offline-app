import AppHeader from '@/components/layout/AppHeader';
import AddHymnForm from '@/components/hymnal/AddHymnForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AddHymnPage() {
  return (
    <>
      <AppHeader 
        title="Add New Hymn"
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/hymnal">
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
            </Link>
          </Button>
        }
      />
      <div className="container mx-auto px-4 pb-8">
        <AddHymnForm />
      </div>
    </>
  );
}
