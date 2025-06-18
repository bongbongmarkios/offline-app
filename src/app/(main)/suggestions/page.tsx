
import AppHeader from '@/components/layout/AppHeader';
import AISuggestionDisplay from '@/components/ai/AISuggestionDisplay';

export const metadata = {
  title: 'Suggestions | SBC App',
};

export default function SuggestionsPage() {
  return (
    <>
      <AppHeader title="AI Suggestions" />
      <div className="container mx-auto px-4 pb-8">
        <AISuggestionDisplay />
      </div>
    </>
  );
}
