
'use client';

import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useTheme, type PrimaryColor } from '@/context/ThemeContext';
import { Moon, Palette, Sun, Settings as SettingsIcon, Loader2, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


const primaryColorOptions: { name: PrimaryColor, label: string, lightClass: string, darkClass: string }[] = [
  { name: 'purple', label: 'Deep Purple', lightClass: 'bg-[#673AB7]', darkClass: 'bg-[#8B5CF6]' },
  { name: 'skyBlue', label: 'Sky Blue', lightClass: 'bg-[#2196F3]', darkClass: 'bg-[#38BDF8]' },
  { name: 'avocadoGreen', label: 'Avocado Green', lightClass: 'bg-[#8BC34A]', darkClass: 'bg-[#A3E635]' }, // Using slightly different greens for demo
  { name: 'maroon', label: 'Maroon', lightClass: 'bg-[#800000]', darkClass: 'bg-[#C026D3]' }, // Using a magenta for dark maroon demo
];


export default function SettingsPage() {
  const { theme, setTheme, primaryColor, setPrimaryColor, isThemeReady } = useTheme();
  const router = useRouter();

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handlePrimaryColorChange = (value: string) => {
    setPrimaryColor(value as PrimaryColor);
  };

  const headerTitleContent = (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-headline font-semibold text-primary sm:text-3xl">
        Settings
      </h1>
    </div>
  );

  if (!isThemeReady) {
    return (
      <>
        <AppHeader title={headerTitleContent} />
        <div className="container mx-auto px-4 pb-8">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                Loading Settings...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-1/3 mt-4" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={headerTitleContent} />
      <div className="container mx-auto px-4 pb-8">
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center font-headline text-2xl">
              <SettingsIcon className="mr-3 h-7 w-7 text-primary" />
              Application Settings
            </CardTitle>
            <CardDescription>
              Customize the appearance of your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                {theme === 'dark' ? <Moon className="mr-2 h-5 w-5" /> : <Sun className="mr-2 h-5 w-5" />}
                Appearance Theme
              </h3>
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <Label htmlFor="theme-switch" className="flex-grow">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Label>
                <Switch
                  id="theme-switch"
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeChange}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                />
              </div>
            </div>

            {/* Primary Color Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Primary Color
              </h3>
              <RadioGroup
                value={primaryColor}
                onValueChange={handlePrimaryColorChange}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {primaryColorOptions.map((option) => (
                  <Label
                    key={option.name}
                    htmlFor={`color-${option.name}`}
                    className="flex items-center space-x-3 rounded-md border p-4 hover:bg-accent/50 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <RadioGroupItem value={option.name} id={`color-${option.name}`} />
                    <div className={`h-5 w-5 rounded-full ${theme === 'light' ? option.lightClass : option.darkClass}`}></div>
                    <span className="font-medium">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
