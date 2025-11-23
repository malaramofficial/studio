"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Send, User, Loader2, Instagram } from "lucide-react";
import { getAiTutorExplanation } from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import { InstagramModal } from "@/components/creator/instagram-modal";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  uiAction?: 'NONE' | 'SHOW_INSTAGRAM_BUTTON';
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  const creatorInstagramHandle = "malaramofficial";
  const creatorInstagramUrl = `https://instagram.com/${creatorInstagramHandle}`;


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic) {
        setMessages([{id: Date.now(), role: 'assistant', content: `नमस्ते! मैं आपका AI ट्यूटर हूँ। आप "${topic}" के बारे में क्या जानना चाहते हैं?`}]);
    } else {
        setMessages([{id: Date.now(), role: 'assistant', content: "नमस्ते! मैं आपका AI ट्यूटर हूँ। आप किस विषय के बारे में जानना चाहते हैं?"}])
    }
  }, [searchParams]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    startTransition(async () => {
      const response = await getAiTutorExplanation(input);
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.explanation,
        uiAction: response.uiAction,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    });
  };

  return (
    <>
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-card rounded-2xl shadow-lg">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarFallback>
                  <BrainCircuit />
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col gap-2 items-start">
              <div
                className={`max-w-xl rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none self-end"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.uiAction === 'SHOW_INSTAGRAM_BUTTON' && (
                  <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-fit">
                      <Instagram /> Instagram पर जाएं
                  </Button>
              )}
            </div>
            {message.role === "user" && (
              <Avatar className="h-10 w-10 border-2 border-accent">
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
         {isPending && (
            <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarFallback><BrainCircuit /></AvatarFallback>
                </Avatar>
                <div className="max-w-xl rounded-2xl px-4 py-3 bg-muted text-foreground rounded-bl-none">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4 bg-card rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="अपना सवाल यहाँ लिखें..."
            className="flex-1 h-12 text-base rounded-xl"
            disabled={isPending}
          />
          <Button type="submit" size="icon" className="h-12 w-12 rounded-xl" disabled={isPending}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
    <InstagramModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} handle={creatorInstagramHandle} redirectUrl={creatorInstagramUrl} />
    </>
  );
}
