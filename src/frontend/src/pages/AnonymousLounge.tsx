import { Button } from "@/components/ui/button";
import { Clock, Send, ShieldAlert, CalendarPlus, MoreVertical, Shield } from "lucide-react";
import { useState, useEffect } from "react";

interface Message {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  expiresAt: Date;
  avatarColor: string;
}

export function AnonymousLounge() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      author: "BlueOrbit19",
      content: "Anyone up for badminton tonight? I have an extra racket.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      expiresAt: new Date(Date.now() + 1000 * 60 * 90),
      avatarColor: "bg-blue-500",
    },
    {
      id: "2",
      author: "QuietFalcon42",
      content: "I'd be down! Where do you usually play?",
      createdAt: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
      expiresAt: new Date(Date.now() + 1000 * 60 * 95),
      avatarColor: "bg-green-500",
    },
    {
      id: "3",
      author: "GreenPanda18",
      content: "Long day today. I just need to vent for a second.",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      expiresAt: new Date(Date.now() + 1000 * 60 * 115),
      avatarColor: "bg-teal-500",
    },
  ]);
  
  const [input, setInput] = useState("");
  const [, setTick] = useState(0);

  // Force re-render every minute to update countdowns
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      author: "SilverFox99", // Current user anonymous alias
      content: input.trim(),
      createdAt: now,
      expiresAt: new Date(now.getTime() + 1000 * 60 * 120), // + 2 hours
      avatarColor: "bg-purple-500",
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  const getRemainingTime = (expiresAt: Date) => {
    const diff = expiresAt.getTime() - Date.now();
    if (diff <= 0) return "Expired";
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes > 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m remaining`;
    return `${minutes}m remaining`;
  };

  // Filter out truly expired messages so they physically disappear from UI
  const activeMessages = messages.filter(m => m.expiresAt.getTime() > Date.now());

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Persistent Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/20 rounded-lg">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">General Anonymous Lounge</p>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" /> Messages in this space disappear after 2 hours.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-xs font-semibold text-muted-foreground">34 online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {activeMessages.map(msg => (
          <div key={msg.id} className="flex gap-4 group">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold shadow-sm ${msg.avatarColor}`}>
              {msg.author.charAt(0)}
            </div>
            <div className="flex-1 max-w-2xl">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-sm text-foreground">{msg.author}</span>
                <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {getRemainingTime(msg.expiresAt)}
                </span>
              </div>
              <div className="bg-muted/50 border border-border p-3.5 rounded-2xl rounded-tl-none text-sm text-foreground leading-relaxed">
                {msg.content}
              </div>
              <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground">Reply</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 gap-1.5">
                  <CalendarPlus className="w-3.5 h-3.5" /> Turn this into a plan
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {activeMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3">
            <ShieldAlert className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">It's quiet here. All previous messages have expired.</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-card border border-border rounded-2xl p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type an anonymous message..."
            className="flex-1 bg-transparent border-none focus:outline-none resize-none px-3 py-2 text-sm text-foreground min-h-[44px] max-h-32"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()} className="h-10 w-10 rounded-xl flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" /> Sending as SilverFox99. Messages are temporary and not permanently logged.
        </p>
      </div>
    </div>
  );
}
