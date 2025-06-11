import BottomNavigationBar from '@/components/layout/BottomNavigationBar';
import { Toaster } from '@/components/ui/toaster';
import { ActivityProvider } from '@/hooks/useActivityTracker';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ActivityProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-grow pb-20"> {/* Padding at bottom for the nav bar */}
          {children}
        </div>
        <BottomNavigationBar />
        {/* Toaster is already in RootLayout, can be removed if preferred there */}
      </div>
    </ActivityProvider>
  );
}
