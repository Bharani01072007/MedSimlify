import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Phone, Send, Video, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader, PhoneFrame } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAllChatMessagesApi,
  getActiveVideoSessionApi,
  sendChatMessageApi,
} from "@/lib/api-client";
import { chatSuggestions, doctor } from "@/lib/medsimplify-data";
import { setLastReadMsgId } from "@/lib/chat-notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat with your doctor — MedSimplify" },
      {
        name: "description",
        content: "Message your doctor about symptoms, medicines and test results between visits.",
      },
      { property: "og:title", content: "Chat with your doctor — MedSimplify" },
      { property: "og:description", content: "Quick answers from your doctor between visits." },
    ],
  }),
  component: ChatScreen,
});

interface ChatMsg {
  id: number;
  sender: "patient" | "doctor";
  sender_name: string;
  message: string;
  time: string;
}

function ChatScreen() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [videoSession, setVideoSession] = useState<any>(null);
  const [showVideo, setShowVideo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Seed with local data so screen isn't blank while loading
  useEffect(() => {
    loadMessages();
    checkVideoSession();

    // Poll for new messages every 4 seconds
    pollRef.current = setInterval(() => {
      loadMessages();
      checkVideoSession();
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    try {
      const data = await getAllChatMessagesApi(1);
      if (data && data.length > 0) {
        setMessages(data.map((m: any) => ({
          id: m.id,
          sender: m.sender,
          sender_name: m.sender_name,
          message: m.message,
          time: m.time,
        })));
        const maxId = Math.max(...data.map((m: any) => m.id || 0));
        if (maxId > 0) {
          setLastReadMsgId(maxId);
        }
      }
    } catch {
      // Backend offline — keep existing messages
    }
  }

  async function checkVideoSession() {
    try {
      const session = await getActiveVideoSessionApi();
      setVideoSession(session);
      if (session?.is_active && !showVideo) {
        toast.info("📹 Dr. Priya Sharma has started a video consultation — tap to join!", {
          duration: 8000,
          action: { label: "Join", onClick: () => setShowVideo(true) },
        });
      }
    } catch {
      // ignore
    }
  }

  async function send(text: string) {
    const value = text.trim();
    if (!value || sending) return;
    setDraft("");
    setSending(true);

    // Optimistic update
    const optimistic: ChatMsg = {
      id: Date.now(),
      sender: "patient",
      sender_name: "Rajesh Kumar",
      message: value,
      time: "Just now",
    };
    setMessages((m) => [...m, optimistic]);

    try {
      await sendChatMessageApi(value, "patient", "Rajesh Kumar", 1);
      await loadMessages(); // refresh with real server IDs
    } catch {
      // Keep optimistic — backend offline
    } finally {
      setSending(false);
    }
  }

  if (showVideo && videoSession?.jitsi_url) {
    return (
      <PhoneFrame>
        <div className="relative flex h-screen flex-col bg-black">
          <div className="flex items-center justify-between bg-black/90 px-4 py-3">
            <div className="text-white">
              <p className="text-[15px] font-bold">📹 Video Consultation</p>
              <p className="text-[12px] text-white/70">with {videoSession.doctor_name}</p>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setShowVideo(false)}
            >
              <X className="size-5" /> End
            </Button>
          </div>
          <iframe
            src={`${videoSession.jitsi_url}#config.prejoinPageEnabled=false&config.startWithVideoMuted=false`}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="flex-1 w-full border-0"
            title="Video consultation"
          />
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <PageHeader
        title={doctor.name}
        subtitle={`${doctor.specialty} · usually replies in 2 hours`}
        back="/home"
        right={
          videoSession?.is_active ? (
            <Button
              size="sm"
              className="h-9 text-[13px] bg-green-600 hover:bg-green-700"
              onClick={() => setShowVideo(true)}
            >
              <Video className="size-4 mr-1" /> Join Call
            </Button>
          ) : null
        }
      />

      {/* Emergency warning */}
      <div className="flex items-start gap-2 bg-destructive/10 px-4 py-2 text-[13px] text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <p>Emergency? Do not wait — call <strong>108</strong> immediately.</p>
      </div>

      {/* Video call banner */}
      {videoSession?.is_active && (
        <div
          className="flex cursor-pointer items-center gap-3 bg-green-600 px-4 py-3 text-white"
          onClick={() => setShowVideo(true)}
        >
          <Video className="size-5 shrink-0" />
          <div className="flex-1">
            <p className="text-[14px] font-bold">Video call in progress</p>
            <p className="text-[12px] opacity-90">Tap to join</p>
          </div>
          <Phone className="size-5 animate-pulse" />
        </div>
      )}

      {/* Messages */}
      <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 pb-4" style={{ minHeight: 0, flex: "1 1 0" }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <p className="text-[16px] font-medium">No messages yet</p>
            <p className="text-[13px] mt-1">Send a message to start the conversation with Dr. Priya Sharma</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.sender === "patient" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[82%] rounded-xl px-3 py-2 text-[15px]",
                m.sender === "patient"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground",
              )}
            >
              {m.sender === "doctor" && (
                <p className="text-[11px] font-semibold text-primary mb-0.5">{m.sender_name}</p>
              )}
              <p className="leading-snug">{m.message}</p>
              <p className={cn("mt-1 text-[11px]", m.sender === "patient" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input bar */}
      <div className="sticky bottom-0 border-t border-border bg-card px-4 py-3">
        <div className="mb-2 flex gap-2 overflow-x-auto">
          {chatSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="tap-target whitespace-nowrap rounded-full border border-border px-3 py-1 text-[13px] text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e: any) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <Input
            value={draft}
            onChange={(e: any) => setDraft(e.target.value)}
            placeholder="Type your message…"
            aria-label="Message"
            className="h-12 text-[15px]"
          />
          <Button type="submit" aria-label="Send message" disabled={sending} className="size-12 shrink-0 p-0">
            <Send className="size-5" />
          </Button>
        </form>
      </div>
    </PhoneFrame>
  );
}
