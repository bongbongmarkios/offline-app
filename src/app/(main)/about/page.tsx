
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export const metadata = {
  title: 'About | SBC APP',
};

export default function AboutPage() {
  return (
    <>
      <AppHeader title="About SBC APP" />
      <div className="container mx-auto px-4 pb-8">
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-6 w-6 text-primary" />
              About This Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Information about the SBC APP, its version, and purpose will be displayed here.
            </p>
            <p className="mt-4 text-sm">
              Version: 1.0.0 (Placeholder)
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
