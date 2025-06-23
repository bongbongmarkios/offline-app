
'use client';

import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useTheme, type PrimaryColor, type FontStyle } from '@/context/ThemeContext';
import { Moon, Palette, Sun, Settings as SettingsIcon, Loader2, ArrowLeft, DatabaseZap, Eraser, Type } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';


const primaryColorOptions: { name: PrimaryColor, label: string, lightClass: string, darkClass: string }[] = [
  { name: 'purple', label: 'Deep Purple', lightClass: 'bg-[#673AB7]', darkClass: 'bg-[#8B5CF6]' },
  { name: 'skyBlue', label: 'Sky Blue', lightClass: 'bg-[#2196F3]', darkClass: 'bg-[#38BDF8]' },
  { name: 'avocadoGreen', label: 'Avocado Green', lightClass: 'bg-[#8BC34A]', darkClass: 'bg-[#A3E635]' },
  { name: 'maroon', label: 'Maroon', lightClass: 'bg-[#800000]', darkClass: 'bg-[#C026D3]' },
];

const fontStyleOptions: { name: FontStyle, label: string, fontClass: string }[] = [
  { name: 'default', label: 'Default (Literata & Belleza)', fontClass: 'font-body' },
  { name: 'modern', label: 'Modern (Sans-Serif)', fontClass: 'font-inter' },
  { name: 'classic', label: 'Classic (Serif)', fontClass: 'font-lora' },
  { name: 'system-sans', label: 'System (Sans-Serif)', fontClass: 'font-system-sans' },
  { name: 'system-serif', label: 'System (Serif)', fontClass: 'font-system-serif' },
];


export default function SettingsPage() {
  const { theme, setTheme, primaryColor, setPrimaryColor, fontStyle, setFontStyle, isThemeReady } = useTheme();
  const router = useRouter();

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handlePrimaryColorChange = (value: string) => {
    setPrimaryColor(value as PrimaryColor);
  };

  const handleFontStyleChange = (value: string) => {
    setFontStyle(value as FontStyle);
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

            {/* Font Style Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Type className="mr-2 h-5 w-5" />
                Font Style
              </h3>
              <RadioGroup
                value={fontStyle}
                onValueChange={handleFontStyleChange}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {fontStyleOptions.map((option) => (
                  <Label
                    key={option.name}
                    htmlFor={`font-${option.name}`}
                    className="flex items-center space-x-3 rounded-md border p-4 hover:bg-accent/50 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <RadioGroupItem value={option.name} id={`font-${option.name}`} />
                    <span className={cn('font-medium', option.fontClass)}>{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

          </CardContent>
        </Card>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center font-headline text-xl">
                <DatabaseZap className="mr-3 h-6 w-6 text-accent" />
                Data Management
                </CardTitle>
                <CardDescription>
                Advanced options for managing application data stored in your browser.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                If the app is not behaving as expected (e.g., hymns or programs are missing), a full reset can resolve the issue by clearing all stored data and starting fresh with the app's default content.
                </p>
                <Link href="/delete-data" passHref>
                <Button variant="destructive" className="w-full sm:w-auto">
                    <Eraser className="mr-2 h-4 w-4" />
                    Reset All Application Data...
                </Button>
                </Link>
            </CardContent>
        </Card>

      </div>
    </>
  );
}
