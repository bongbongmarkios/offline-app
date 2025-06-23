'use client';

import { useState, FormEvent, useRef, useEffect, KeyboardEvent } from 'react';
import type { ChatMessage, Conversation } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Loader2, Sparkles, Menu, FilePlus2, Copy } from 'lucide-react';
import { chatWithGemini } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ChatSidebar from './ChatSidebar';
import { useToast } from '@/hooks/use-toast';

const CHAT_HISTORY_KEY = 'graceNotesChatHistory';

const initialMessage: ChatMessage = {
    id: 'initial-message',
    text: 'Hello! How can I help you today? You can ask me about hymns, readings, or program suggestions.',
    sender: 'ai',
};

const suggestions = [
    'Find a hymn by title',
    'Find lyrics',
    'Create a Sunday program for me',
    'What are the responsive readings?',
    'Suggest a closing hymn',
];

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (storedHistory) {
        setConversations(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage:', error);
      toast({ title: "Error", description: "Could not load chat history.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(conversations));
    } catch (error) {
       console.error('Failed to save chat history to localStorage:', error);
       toast({ title: "Error", description: "Could not save chat history.", variant: "destructive" });
    }
  }, [conversations, toast]);
  
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messagesToDisplay: ChatMessage[] = currentConversation ? currentConversation.messages : [initialMessage];
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(scrollViewport) {
        setTimeout(() => {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }, 0);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesToDisplay]);
  
  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setInput('');
    setIsSidebarOpen(false);
    textareaRef.current?.focus();
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setIsSidebarOpen(false);
    textareaRef.current?.focus();
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if(currentConversationId === id) {
        setCurrentConversationId(null);
    }
    toast({ title: "Chat Deleted", description: "The conversation has been deleted." });
  };


  const handleSubmit = async (e?: FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const prompt = promptOverride || input;
    if (!prompt.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: `msg-${Date.now()}`, text: prompt, sender: 'user' };
    setInput('');
    setIsLoading(true);

    let conversationToUpdateId = currentConversationId;
    let isNewConversation = false;

    if (!conversationToUpdateId) {
        isNewConversation = true;
        const newConversation: Conversation = {
            id: `convo-${Date.now()}`,
            title: prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt,
            messages: [userMessage],
            createdAt: new Date().toISOString(),
        };
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
        conversationToUpdateId = newConversation.id;
    } else {
        setConversations(prev => prev.map(c => 
            c.id === conversationToUpdateId ? { ...c, messages: [...c.messages, userMessage] } : c
        ));
    }
    
    try {
      const aiResponseText = await chatWithGemini({ prompt: userMessage.text });
      const aiMessage: ChatMessage = { id: `msg-${Date.now() + 1}`, text: aiResponseText, sender: 'ai' };
      
      setConversations(prev => prev.map(c => 
          c.id === conversationToUpdateId ? { ...c, messages: [...c.messages, aiMessage] } : c
      ));

    } catch (error) {
      console.error('Error chatting with AI:', error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
      };
      setConversations(prev => prev.map(c => 
          c.id === conversationToUpdateId ? { ...c, messages: [...c.messages, errorMessage] } : c
      ));
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(undefined, suggestion);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(undefined, input);
    }
  }

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
        toast({ title: 'Lyrics Copied!', description: 'The lyrics have been copied to your clipboard.' });
    }, (err) => {
        console.error('Could not copy text: ', err);
        toast({ title: 'Copy Failed', description: 'Could not copy lyrics to clipboard.', variant: 'destructive' });
    });
  };

  return (
    <div className="flex h-full bg-background overflow-hidden">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="p-0 flex flex-col w-3/4 sm:max-w-xs">
                <SheetHeader className="p-4 border-b flex-shrink-0">
                    <SheetTitle>Chat History</SheetTitle>
                </SheetHeader>
                <ChatSidebar 
                  conversations={conversations}
                  currentConversationId={currentConversationId}
                  onSelectConversation={handleSelectConversation}
                  onNewConversation={handleNewConversation}
                  onDeleteConversation={handleDeleteConversation}
                />
            </SheetContent>
        </Sheet>
        <div className="flex flex-col flex-1 h-full">
            <DialogHeader className="p-3 border-b text-left flex flex-row items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-1">
                     <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="flex-shrink-0">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="truncate">
                        <DialogTitle className="flex items-center gap-2 font-headline truncate">
                            <Sparkles className="h-5 w-5 text-primary flex-shrink-0"/>
                            <span className="truncate">{currentConversation?.title || 'SBC Church App AI'}</span>
                        </DialogTitle>
                        {currentConversationId && (
                             <DialogDescription className="text-xs truncate">
                                Chat History
                             </DialogDescription>
                        )}
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleNewConversation} aria-label="New Chat" className="flex-shrink-0">
                    <FilePlus2 className="h-5 w-5" />
                </Button>
            </DialogHeader>

            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messagesToDisplay.map((message) => {
                    const lyricsMatch = message.text.match(/\[START_LYRICS\]([\s\S]*)\[END_LYRICS\]/);

                    return (
                        <div
                        key={message.id}
                        className={cn(
                            'flex items-start gap-3',
                            message.sender === 'user' ? 'justify-end' : ''
                        )}
                        >
                        {message.sender === 'ai' && (
                            <span className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                            <Bot className="h-6 w-6 text-primary" />
                            </span>
                        )}
                        <div
                            className={cn(
                                'max-w-[80%] p-3.5 rounded-xl text-sm',
                                message.sender === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted text-foreground rounded-bl-none'
                            )}
                        >
                            {lyricsMatch ? (
                            <>
                                <p className="whitespace-pre-wrap">{message.text.substring(0, lyricsMatch.index).trim()}</p>
                                <div className="mt-4 p-4 bg-background/50 border rounded-lg relative group">
                                    <pre className="whitespace-pre-wrap font-sans text-sm">{lyricsMatch[1].trim()}</pre>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleCopy(lyricsMatch[1].trim())}
                                        aria-label="Copy lyrics"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                            ) : (
                                <p className="whitespace-pre-wrap">{message.text}</p>
                            )}
                        </div>
                        {message.sender === 'user' && (
                            <span className="flex-shrink-0 p-2 bg-accent/20 rounded-full">
                            <User className="h-6 w-6 text-accent" />
                            </span>
                        )}
                        </div>
                    );
                })}
                {isLoading && currentConversationId === currentConversation?.id && (
                    <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                        <Bot className="h-6 w-6 text-primary" />
                    </span>
                    <div className="max-w-[80%] p-4 rounded-lg bg-muted text-foreground">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <div className="border-t p-4 bg-background flex-shrink-0">
                {messagesToDisplay.length <= 1 && !isLoading && !currentConversationId && (
                    <div className="mb-4 flex flex-wrap items-start gap-2">
                        {suggestions.map((suggestion) => (
                            <Button
                                key={suggestion}
                                variant="outline"
                                size="sm"
                                className="h-auto rounded-full px-3 py-1.5 text-xs font-normal"
                                onClick={() => handleSuggestionClick(suggestion)}
                                disabled={isLoading}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                )}
                <form onSubmit={(e) => handleSubmit(e, input)} className="relative">
                    <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message SBC Church App AI..."
                    className="pr-14 resize-none min-h-[52px] text-base"
                    rows={1}
                    disabled={isLoading}
                    autoFocus
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        disabled={isLoading || !input.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9"
                    >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                    </Button>
                </form>
            </div>
        </div>
    </div>
  );
}
