
import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function AppHeader({ title, actions }: AppHeaderProps) {
  return (
    <header className="bg-card shadow-sm mb-4 md:mb-6 print:hidden">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-headline font-semibold text-primary sm:text-3xl">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
