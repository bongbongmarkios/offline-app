
import type { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function AppHeader({ title, actions }: AppHeaderProps) {
  return (
    <header className="bg-card shadow-sm mb-4 md:mb-6 print:hidden">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* This trigger is primarily for mobile. */}
          <SidebarTrigger className="md:hidden"> {/* Only show on mobile (less than md breakpoint) */}
            <Menu className="h-6 w-6 text-primary" />
          </SidebarTrigger>
          <h1 className="text-2xl font-headline font-semibold text-primary sm:text-3xl">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
