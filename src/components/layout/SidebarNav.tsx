
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, ListOrdered, BookOpenText, Wand2 } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
// import { cn } from '@/lib/utils'; // Not strictly needed if isActive prop handles styling

const navItems = [
  { href: '/hymnal', label: 'Hymnal', icon: Music },
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
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild // Allows the Link component to control navigation and styling
              isActive={isActive}
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
