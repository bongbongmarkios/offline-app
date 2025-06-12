
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, ListOrdered, BookOpenText, Wand2, PlusCircle } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
// import { cn } from '@/lib/utils'; // Not strictly needed if isActive prop handles styling

const navItems = [
  { href: '/hymnal', label: 'Hymnal', icon: Music },
  { href: '/hymnal/add', label: 'Add Hymn', icon: PlusCircle }, // Added "Add Hymn"
  { href: '/program', label: 'Program', icon: ListOrdered },
  { href: '/readings', label: 'Readings', icon: BookOpenText },
  { href: '/suggestions', label: 'Suggestions', icon: Wand2 },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="p-2"> {/* Add some padding around the menu items */}
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
        // Special case for /hymnal/add to not make /hymnal active
        const isSpecificallyActive = item.href === '/hymnal/add' ? pathname === item.href : isActive;


        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild // Allows the Link component to control navigation and styling
              isActive={isSpecificallyActive}
              tooltip={item.label} // Tooltip will show on hover when sidebar is collapsed
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5 shrink-0" /> {/* Ensure icon doesn't shrink text */}
                <span className="truncate">{item.label}</span> {/* Truncate ensures text doesn't overflow */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
