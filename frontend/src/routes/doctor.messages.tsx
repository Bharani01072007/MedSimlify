import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Phone, Search, Send, Video, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BottomNavDoctor, PageHeader, PhoneFrame } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAllChatMessagesApi,
  getActiveVideoSessionApi,
  getDoctorChatThreadsApi,
  endVideoCallApi,
  sendChatMessageApi,
  startVideoCallApi,
} from "@/lib/api-client";
import { doctor } from "@/lib/medsimplify-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/doctor/messages")({
  head: () => ({
    meta: [
      { title: "Patient Messages — MedSimplify Doctor" },
      {
        name: "description",
        content: "Doctor view of secure patient messages, with patient list and one-click video consultation.",
      },
      { property: "og:title", content: "Patient Messages — MedSimplify Doctor" },
      { property: "og:description", content: "Secure patient chat inbox and video consultations." },
    ],
  }),
  component: DoctorMessagesScreen,
});

interface PatientThread {
  id: number;
  chat_id: number;
  patient_name: string;
  age_gender: string;
  condition: string;
  status: "online" | "offline";
  unread_count: number;
  last_message: string;
  last_time: string;
}

interface ChatMsg {
  id: number;
  sender: "patient" | "doctor";
  sender_name: string;
  message: string;
  time: string;
}

function DoctorMessagesScreen() {
  const [threads, setThreads] = useState<PatientThread[]>([]);
  const [activePatient, setActivePatient] = useState<PatientThread | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [videoSession, setVideoSession] = useState<any>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [startingCall, setStartingCall] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadThreads();
    checkVideoSession();

    pollRef.current = setInterval(() => {
      loadThreads();
      checkVideoSession();
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (activePatient) {
      loadMessages(activePatient.chat_id);
    }
  }, [activePatient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadThreads() {
    try {
      const data = await getDoctorChatThreadsApi();
      if (data && data.length > 0) {
        setThreads(data);
      }
    } catch {
      // Backend offline — fallback default threads
      setThreads([
        { id: 1, chat_id: 1, patient_name: "Rajesh Kumar", age_gender: "34M", condition: "Dengue Recovery", status: "online", unread_count: 1, last_message: "Platelet report updated doc, please check", last_time: "10:30 AM" },
        { id: 2, chat_id: 2, patient_name: "Savitri Kumar", age_gender: "64F", condition: "Hypertension & HbA1c", status: "offline", unread_count: 1, last_message: "Should I double the amlodipine dose today?", last_time: "Yesterday" },
        { id: 3, chat_id: 3, patient_name: "Priya Kumar", age_gender: "32F", condition: "Iron Deficiency Anemia", status: "online", unread_count: 1, last_message: "Iron tablets feeling heavy on stomach", last_time: "Sep 19" },
        { id: 4, chat_id: 4, patient_name: "Rohan Kumar", age_gender: "8M", condition: "Pediatric Allergy", status: "offline", unread_count: 0, last_message: "Cough settled down well now", last_time: "Sep 18" },
        { id: 5, chat_id: 5, patient_name: "Ananya Roy", age_gender: "28F", condition: "Thyroid Follow-up", status: "online", unread_count: 0, last_message: "TSH results attached for review", last_time: "Sep 15" },
      ]);
    }
  }

  async function loadMessages(chatId: number) {
    try {
      const data = await getAllChatMessagesApi(chatId);
      if (data && data.length > 0) {
        setMessages(
          data.map((m: any) => ({
            id: m.id,
            sender: m.sender,
            sender_name: m.sender_name,
            message: m.message,
            time: m.time,
          }))
        );
      } else {
        setMessages([]);
      }
    } catch {
      // ignore
    }
  }

  async function checkVideoSession() {
    try {
      const session = await getActiveVideoSessionApi();
      setVideoSession(session);
    } catch {
      // ignore
    }
  }

  async function selectThread(t: PatientThread) {
    setActivePatient(t);
    // Optimistically clear unread count for selected thread
    setThreads((prev) =>
      prev.map((item) => (item.chat_id === t.chat_id ? { ...item, unread_count: 0 } : item))
    );
    await loadMessages(t.chat_id);
  }

  async function send(text: string) {
    if (!activePatient) return;
    const value = text.trim();
    if (!value || sending) return;
    setDraft("");
    setSending(true);

    const optimistic: ChatMsg = {
      id: Date.now(),
      sender: "doctor",
      sender_name: doctor.name,
      message: value,
      time: "Just now",
    };
    setMessages((m) => [...m, optimistic]);

    try {
      await sendChatMessageApi(value, "doctor", doctor.name, activePatient.chat_id);
      await loadMessages(activePatient.chat_id);
      await loadThreads();
    } catch {
      // Keep optimistic
    } finally {
      setSending(false);
    }
  }

  async function startCall() {
    if (!activePatient) return;
    setStartingCall(true);
    try {
      const session = await startVideoCallApi(doctor.name, activePatient.patient_name);
      setVideoSession(session);
      toast.success(`📹 Video call started with ${activePatient.patient_name}! Patient notified.`);
    } catch {
      const mockSession = {
        is_active: true,
        room_id: `medsimplify-${activePatient.chat_id}`,
        jitsi_url: `https://meet.jit.si/medsimplify-room-${activePatient.chat_id}`,
        doctor_name: doctor.name,
        patient_name: activePatient.patient_name,
        started_at: new Date().toLocaleTimeString(),
      };
      setVideoSession(mockSession);
      toast.success("📹 Video call room created (demo mode)!");
    } finally {
      setStartingCall(false);
    }
  }

  async function endCall() {
    try {
      await endVideoCallApi();
    } catch {
      // ignore
    }
    setVideoSession((s: any) => ({ ...s, is_active: false }));
    setShowVideo(false);
    toast("Video call ended.");
  }

  // Jitsi video embed — full screen view
  if (showVideo && videoSession?.jitsi_url) {
    return (
      <PhoneFrame>
        <div className="relative flex h-screen flex-col bg-black">
          <div className="flex items-center justify-between bg-black/90 px-4 py-3">
            <div className="text-white">
              <p className="text-[15px] font-bold">📹 Video Consultation</p>
              <p className="text-[12px] text-white/70">
                Patient: {videoSession.patient_name} · Started {videoSession.started_at}
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-red-400 hover:bg-white/20"
              onClick={endCall}
            >
              <X className="size-5" /> End Call
            </Button>
          </div>
          <iframe
            src={`${videoSession.jitsi_url}#config.prejoinPageEnabled=false&config.startWithVideoMuted=false&userInfo.displayName=${encodeURIComponent(doctor.name)}`}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="flex-1 w-full border-0"
            title="Video consultation"
          />
        </div>
      </PhoneFrame>
    );
  }

  const filteredThreads = threads.filter(
    (t) =>
      t.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = threads.reduce((acc, t) => acc + (t.unread_count || 0), 0);

  return (
    <PhoneFrame>
      {activePatient ? (
        // ── Active Patient Chat Thread View ──
        <>
          <PageHeader
            title={activePatient.patient_name}
            subtitle={`${activePatient.condition} · ${activePatient.age_gender}`}
            onBack={() => setActivePatient(null)}
            right={
              videoSession?.is_active ? (
                <Button
                  size="sm"
                  className="h-9 text-[13px] bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowVideo(true)}
                >
                  <Video className="size-4 mr-1" /> Rejoin
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 text-[13px]"
                  disabled={startingCall}
                  onClick={startCall}
                >
                  <Video className="size-4 mr-1" />
                  {startingCall ? "Starting…" : "Video Call"}
                </Button>
              )
            }
          />

          {/* Active video call banner */}
          {videoSession?.is_active && (
            <div
              className="flex cursor-pointer items-center gap-3 bg-green-600 px-4 py-3 text-white"
              onClick={() => setShowVideo(true)}
            >
              <Video className="size-5 shrink-0" />
              <div className="flex-1">
                <p className="text-[14px] font-bold">Video consultation in progress</p>
                <p className="text-[12px] opacity-90">
                  Patient: {videoSession.patient_name} · Tap to return
                </p>
              </div>
              <Phone className="size-5 animate-pulse" />
            </div>
          )}

          {/* Messages List */}
          <main
            className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            style={{ minHeight: 0, flex: "1 1 0" }}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <MessageSquare className="size-10 opacity-40 mb-2 text-primary" />
                <p className="text-[16px] font-medium">No messages yet with {activePatient.patient_name}</p>
                <p className="text-[13px] mt-1">Send a message below to start the conversation.</p>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.sender === "doctor" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[82%] rounded-xl px-3.5 py-2.5 text-[15px]",
                    m.sender === "doctor"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-foreground shadow-sm"
                  )}
                >
                  {m.sender === "patient" && (
                    <p className="text-[11px] font-semibold text-primary mb-0.5">{m.sender_name}</p>
                  )}
                  <p className="leading-snug">{m.message}</p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      m.sender === "doctor"
                        ? "text-primary-foreground/70 text-right"
                        : "text-muted-foreground"
                    )}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </main>

          {/* Quick reply suggestions for doctor */}
          <div className="sticky bottom-0 border-t border-border bg-card px-4 py-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {[
                "Get a repeat CBC test tomorrow morning.",
                "Continue current medicines.",
                "Come in for a clinic visit today.",
                "Go to ER immediately.",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="tap-target shrink-0 whitespace-nowrap rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[12px] font-medium text-primary hover:bg-primary/10"
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
                placeholder={`Reply to ${activePatient.patient_name}…`}
                aria-label="Doctor reply"
                className="h-12 text-[15px]"
              />
              <Button
                type="submit"
                aria-label="Send reply"
                disabled={sending || !draft.trim()}
                className="size-12 shrink-0 p-0"
              >
                <Send className="size-5" />
              </Button>
            </form>
          </div>
        </>
      ) : (
        // ── Patients Chat List Inbox View ──
        <>
          <PageHeader
            title="Patient Chat Inbox"
            subtitle={`${threads.length} Patient Conversations · ${totalUnread} Unread`}
            back="/doctor/dashboard"
          />

          {/* Search bar */}
          <div className="border-b border-border bg-card px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                placeholder="Search patient name or condition…"
                className="h-11 pl-9 text-[14px]"
              />
            </div>
          </div>

          {/* Patient list */}
          <main
            className="flex flex-1 flex-col overflow-y-auto divide-y divide-border"
            style={{ minHeight: 0, flex: "1 1 0" }}
          >
            {filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Search className="size-10 opacity-30 mb-2" />
                <p className="text-[15px] font-medium">No matching patient conversations</p>
              </div>
            ) : (
              filteredThreads.map((t) => (
                <div
                  key={t.chat_id}
                  onClick={() => selectThread(t)}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50",
                    t.unread_count > 0 ? "bg-primary/5" : "bg-card"
                  )}
                >
                  {/* Patient Avatar & Status Dot */}
                  <div className="relative shrink-0">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base">
                      {t.patient_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 size-3 rounded-full border-2 border-white",
                        t.status === "online" ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  </div>

                  {/* Patient Details & Last Message */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-bold text-foreground truncate">
                        {t.patient_name}{" "}
                        <span className="text-[13px] font-normal text-muted-foreground">
                          ({t.age_gender})
                        </span>
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{t.last_time}</span>
                    </div>

                    <p className="text-[12px] font-semibold text-primary mb-1">{t.condition}</p>

                    <p className={cn(
                      "text-[13px] line-clamp-1",
                      t.unread_count > 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                    )}>
                      {t.last_message}
                    </p>
                  </div>

                  {/* Unread Counter Badge */}
                  {t.unread_count > 0 && (
                    <Badge variant="destructive" className="shrink-0 text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {t.unread_count} new
                    </Badge>
                  )}
                </div>
              ))
            )}
          </main>
        </>
      )}

      <BottomNavDoctor />
    </PhoneFrame>
  );
}
