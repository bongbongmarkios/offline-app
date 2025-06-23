
'use client';

import { useState, FormEvent, useRef, useEffect, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { chatWithGemini } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const initialMessage: Message = {
    id: 'initial-message',
    text: 'Hello! How can I help you today? You can ask me about hymns, readings, or program suggestions.',
    sender: 'ai',
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  }, [messages]);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await chatWithGemini({ prompt: userMessage.text });
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error chatting with AI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
       <DialogHeader className="p-4 border-b text-left">
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="h-5 w-5 text-primary"/>
            SBC Church App AI
          </DialogTitle>
          <DialogDescription>
            Ask me about hymns, readings, or program suggestions.
          </DialogDescription>
        </DialogHeader>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
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
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
              {message.sender === 'user' && (
                 <span className="flex-shrink-0 p-2 bg-accent/20 rounded-full">
                  <User className="h-6 w-6 text-accent" />
                </span>
              )}
            </div>
          ))}
          {isLoading && (
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
      <div className="border-t p-4 bg-background">
          <form onSubmit={handleSubmit} className="relative">
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
  );
}
