
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArchiveRestore, Info } from 'lucide-react';

export const metadata = {
  title: 'Trash | GraceNotes',
};

export default function TrashPage() {
  return (
    <>
      <AppHeader title="Trash" />
      <div className="container mx-auto px-4 pb-8">
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArchiveRestore className="mr-2 h-6 w-6 text-primary" />
              Deleted Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This section is intended for viewing and managing items (like hymns or readings) that you have deleted.
            </p>
            <div className="p-4 bg-secondary/50 rounded-md border border-dashed">
                <div className="flex items-start">
                    <Info className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-accent">Please Note:</h4>
                        <p className="text-sm text-muted-foreground">
                        Currently, items deleted from the Hymnal or Readings sections are removed permanently and will not appear here.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                        Future enhancements may include the ability to temporarily store deleted items here for restoration.
                        </p>
                    </div>
                </div>
            </div>
             {/* Placeholder for future list of deleted items */}
             <div className="text-center py-10 text-muted-foreground">
              <p>(No recoverable items at this time)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
