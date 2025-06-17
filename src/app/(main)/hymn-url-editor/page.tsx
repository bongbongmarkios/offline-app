
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export const metadata = {
  title: 'Manage Hymn URLs | GraceNotes',
};

export default function HymnUrlEditorPage() {
  return (
    <>
      <AppHeader title="Manage Hymn URLs" />
      <div className="container mx-auto px-4 pb-8">
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-6 w-6 text-primary" />
              Hymn URL Editor
            </CardTitle>
            <CardDescription>
              This section will allow you to associate external URLs (e.g., sheet music, recordings) with hymns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Functionality to add, edit, and delete URLs for hymns is coming soon.
            </p>
            <div className="mt-6 p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30">
              <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">Under Development</h4>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                The ability to select a hymn and input a URL will be implemented here.
                Saved URLs will then appear on the main hymn list and hymn detail pages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
