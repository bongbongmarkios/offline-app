
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, UserCircle, Target, BookOpenCheck, ListChecks } from 'lucide-react';

export const metadata = {
  title: 'About | GraceNotes',
};

export default function AboutPage() {
  return (
    <>
      <AppHeader title="About GraceNotes" />
      <div className="container mx-auto px-4 pb-8">
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center font-headline text-2xl">
              <Info className="mr-3 h-7 w-7 text-primary" />
              About This Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <UserCircle className="mr-2 h-5 w-5 text-accent" />
                Developer
              </h3>
              <p className="text-muted-foreground">
                This application, GraceNotes, was developed by John Mark Solomon.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <Target className="mr-2 h-5 w-5 text-accent" />
                Purpose
              </h3>
              <p className="text-muted-foreground">
                GraceNotes aims to make hymnals more accessible, providing an intuitive platform for:
              </p>
              <ul className="list-disc list-inside pl-4 text-muted-foreground space-y-1">
                <li className="flex items-start">
                  <BookOpenCheck className="mr-2 h-4 w-4 mt-1 flex-shrink-0 text-green-600" />
                  <span>Easy navigation of hymnals and responsive readings.</span>
                </li>
                <li className="flex items-start">
                  <ListChecks className="mr-2 h-4 w-4 mt-1 flex-shrink-0 text-green-600" />
                  <span>Facilitating a smooth and organized flow for Sunday programs.</span>
                </li>
              </ul>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">
              Version: 1.0.0 (Placeholder)
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
