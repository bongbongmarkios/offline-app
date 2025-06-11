import type { ReactNode } from 'react';

interface AppHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function AppHeader({ title, actions }: AppHeaderProps) {
  return (
    <header className="bg-card shadow-sm mb-4 md:mb-6 print:hidden">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-headline font-semibold text-primary sm:text-3xl">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
