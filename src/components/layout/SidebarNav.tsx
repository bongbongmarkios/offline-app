
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, ListOrdered, BookOpenText, Wand2, PlusCircle, Settings, HelpCircle, Info, Trash2 } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator, // Import if you plan to use a visual separator
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/hymnal', label: 'Hymnal', icon: Music },
  { href: '/hymnal/add', label: 'Add Hymn', icon: PlusCircle },
  { href: '/program', label: 'Program', icon: ListOrdered },
  { href: '/readings', label: 'Readings', icon: BookOpenText },
  { href: '/suggestions', label: 'Suggestions', icon: Wand2 },
  // Adding a conceptual separator or simply listing them.
  // For actual visual separation, you might need a custom component or style adjustments.
  // For now, we'll add a placeholder for a separator if needed, or just list them.
  // { type: 'separator' }, // Placeholder if SidebarSeparator can be used here
  { href: '/settings', label: 'Settings', icon: Settings, group: 'utility' },
  { href: '/help', label: 'Help', icon: HelpCircle, group: 'utility' },
  { href: '/about', label: 'About', icon: Info, group: 'utility' },
  { href: '/delete-data', label: 'Delete Data', icon: Trash2, isDestructive: true, group: 'utility' },
];

export default function SidebarNav() {
  const pathname = usePathname();

  // Example of how to potentially group items if needed, though not fully implemented here.
  // const primaryNavItems = navItems.filter(item => !item.group);
  // const utilityNavItems = navItems.filter(item => item.group === 'utility');

  return (
    <SidebarMenu className="p-2"> {/* Add some padding around the menu items */}
      {navItems.map((item, index) => {
        // if (item.type === 'separator') {
        //   return <SidebarSeparator key={`sep-${index}`} className="my-2" />;
        // }

        const isActive = pathname === item.href || (item.href !== '/' && item.href && pathname.startsWith(item.href + '/'));
        // Special case for /hymnal/add to not make /hymnal active
        const isSpecificallyActive = item.href === '/hymnal/add' ? pathname === item.href : isActive;

        return (
          <SidebarMenuItem key={item.href || `item-${index}`}>
            <SidebarMenuButton
              asChild // Allows the Link component to control navigation and styling
              isActive={isSpecificallyActive}
              tooltip={item.label} // Tooltip will show on hover when sidebar is collapsed
            >
              <Link href={item.href || '#'}>
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={cn("truncate", item.isDestructive && "text-destructive group-hover:text-destructive-foreground")}>
                  {item.label}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

