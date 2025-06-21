'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, ListOrdered, BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/hymnal', label: 'Hymnal', icon: Music },
  { href: '/readings', label: 'Readings', icon: BookOpenText },
  { href: '/program', label: 'Program', icon: ListOrdered },
];

export default function BottomNavigationBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg h-16 flex justify-around items-center z-50 print:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + (item.href.endsWith('/') ? '' : '/')));
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            prefetch={true} // Explicitly enable prefetching
            className={cn(
              "flex flex-col items-center justify-center text-xs sm:text-sm transition-colors w-1/3 h-full pt-1",
              isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1" strokeWidth={isActive ? 2.5 : 2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
