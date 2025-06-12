
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import { Toaster } from '@/components/ui/toaster';
import { ActivityProvider } from '@/hooks/useActivityTracker';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/layout/SidebarNav';
import Image from 'next/image'; // Import Next Image

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}> {/* Start collapsed on desktop */}
      <ActivityProvider>
        {/* Sidebar for desktop, hidden on mobile (mobile uses Sheet via SidebarTrigger) */}
        <Sidebar collapsible="icon" className="border-r bg-card hidden md:flex" side="left">
          <SidebarHeader className="p-2 flex flex-row items-center justify-center group-data-[state=expanded]:justify-start group-data-[state=expanded]:pl-3">
            <Image src="https://i.imgur.com/BJ43v7S.png" alt="SBC APP Logo" width={36} height={36} data-ai-hint="logo" className="shrink-0 group-data-[state=expanded]:mr-2" />
            <div className="font-headline text-xl text-primary group-data-[state=expanded]:block hidden whitespace-nowrap">SBC APP</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="flex flex-col min-h-screen"> {/* Maintain overall page structure */}
            <div className="flex-grow pb-20"> {/* Padding at bottom for the nav bar */}
              {children} {/* This includes AppHeader which will have the mobile trigger */}
            </div>
            <BottomNavigationBar /> {/* Retained for mobile, could be conditionally hidden on desktop */}
          </div>
        </SidebarInset>
        <Toaster />
      </ActivityProvider>
    </SidebarProvider>
  );
}
