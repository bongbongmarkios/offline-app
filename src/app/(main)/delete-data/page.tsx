
'use client'; // Add 'use client' for onClick handlers and potential hooks

import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useActivity } from '@/hooks/useActivityTracker';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export const metadata = {
  title: 'Delete Data | SBC APP',
};

export default function DeleteDataPage() {
  const { clearActivity } = useActivity();
  const { toast } = useToast();

  const handleDeleteData = () => {
    clearActivity();
    toast({
      title: "Data Cleared",
      description: "Your local activity history has been cleared.",
      variant: "default",
    });
    console.log("User activity data has been cleared.");
  };

  return (
    <>
      <AppHeader title="Delete User Data" />
      <div className="container mx-auto px-4 pb-8">
        <Card className="mt-6 border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Delete All User Data
            </CardTitle>
            <CardDescription className="text-destructive/90">
              This action will permanently delete all your locally stored activity data, including recently viewed hymns, readings, and program items. This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your activity history is used to provide personalized suggestions. Deleting this data will reset these suggestions.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Note: This currently only affects data stored in your browser.
            </p>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Yes, Delete My Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    activity history from your browser.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteData} className={""}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
