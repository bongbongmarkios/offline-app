'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, ListOrdered, BookOpenText, Sparkles } from 'lucide-react'; // Changed BookOpen to BookOpenText for clarity
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/hymnal', label: 'Hymnal', icon: Music },
  { href: '/program', label: 'Program', icon: ListOrdered },
  { href: '/readings', label: 'Readings', icon: BookOpenText },
  { href: '/suggestions', label: 'Suggest', icon: Sparkles },
];

export default function BottomNavigationBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg h-16 flex justify-around items-center z-50 print:hidden">
      {navItems.map((item) => {
        // Check if the current path starts with the item's href.
        // For the root items, this means an exact match or if it's the active section.
        // Example: /hymnal/1 should still highlight Hymnal tab.
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + (item.href.endsWith('/') ? '' : '/')));
        
        // Special case for '/' if you had a home tab. For now, not needed.
        // If item.href is just '/', then isActive should be true only if pathname is also '/'.

        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={cn(
              "flex flex-col items-center justify-center text-xs sm:text-sm transition-colors w-1/4 h-full pt-1",
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
