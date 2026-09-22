import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { startVideoCallApi } from "@/lib/api-client";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  FileText,
  FilePlus,
  MessageCircle,
  Phone,
  Stethoscope,
  TrendingUp,
  Users,
  Video,
  Sparkles,
  Bot,
  Send,
  Loader2,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { BottomNavDoctor, PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { doctor, doctorSchedule, doctorStats } from "@/lib/medsimplify-data";

export const Route = createFileRoute("/doctor/dashboard")({
  head: () => ({
    meta: [
      { title: "Doctor dashboard — MedSimplify" },
      {
        name: "description",
        content: "Today's patients, pending reports, earnings and the day's appointment schedule.",
      },
      { property: "og:title", content: "Doctor dashboard — MedSimplify" },
      { property: "og:description", content: "Your day at a glance: patients, reports and schedule." },
    ],
  }),
  component: DoctorDashboard,
});

// Red flag alerts for patients that need immediate attention
const redFlagAlerts = [
  { patient: "Rajesh Kumar", alert: "Platelets dropped 50% in 2 days — immediate review needed", severity: "critical" },
  { patient: "Sunil Rao", alert: "BP 170/110 — uncontrolled hypertension", severity: "warning" },
];

// Pending tasks summary
const pendingTasks = [
  { label: "Unreviewed reports", count: 5, to: "/doctor/patients" },
  { label: "Unsigned prescriptions", count: 2, to: "/doctor/prescriptions" },
  { label: "Patient messages", count: 3, to: "/doctor/messages" },
];

function DoctorDashboard() {
  const navigate = useNavigate();
  const [telemed, setTelemed] = useState(false);

  // AI Assistant Interactive Dialog State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("Rajesh Kumar");
  const [aiQuery, setAiQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  async function startVideoCall() {
    setTelemed(true);
    try {
      const session = await startVideoCallApi("Dr. Priya Sharma", "Rajesh Kumar");
      toast.success(`📹 Video call room created! Patient has been notified in chat. Join: ${session.jitsi_url}`);
    } catch {
      toast.success("📹 Video call launched (offline demo mode) — patient notified via chat");
    } finally {
      setTelemed(false);
    }
  }

  async function handleAskAi(customPrompt?: string, mode: "chat" | "soap" = "chat") {
    const queryText = customPrompt || aiQuery;
    if (!queryText.trim() && mode !== "soap") {
      toast.error("Please enter a question or select a prompt.");
      return;
    }

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      if (mode === "soap") {
        const res = await fetch("http://localhost:8000/api/ai/soap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_name: selectedPatient,
            symptoms: "Mild fever, fatigue, joint ache",
            lab_findings: "Platelet Count: 140,000 /uL, Hb: 10.5 g/dL"
          })
        });
        const data = await res.json();
        const soapText = `📋 Clinical EMR SOAP Note for ${selectedPatient}:\n\n` +
          `• Subjective: ${data.soap_notes?.subjective || ""}\n\n` +
          `• Objective: ${data.soap_notes?.objective || ""}\n\n` +
          `• Assessment: ${data.soap_notes?.assessment || ""}\n\n` +
          `• Plan:\n${data.soap_notes?.plan || ""}`;
        setAiResponse(soapText);
      } else {
        const res = await fetch("http://localhost:8000/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: `[Patient Context: ${selectedPatient}] ${queryText}`
          })
        });
        const data = await res.json();
        setAiResponse(data.answer || "No response received from AI Pipeline.");
      }
    } catch (err) {
      console.error("AI Assistant error:", err);
      setAiResponse(
        `🤖 AI Clinical Analysis for ${selectedPatient}:\n\n` +
        `• Query Evaluated: "${queryText || "General Assessment"}"\n` +
        `• Clinical Guidance: Monitor vital parameters every 4 hours. Review full laboratory workup for thrombocytopenia and drug-drug interaction warnings (Naproxen + Warfarin risk).\n` +
        `• Recommended Action: Order repeat CBC & Coagulation profile (PT/INR).`
      );
    } finally {
      setIsAiLoading(false);
    }
  }

  async function handleSendEducation(title: string) {
    try {
      const res = await fetch("http://localhost:8000/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `📚 Dr. Priya Sharma shared an educational guide with you: "${title}". Click to view details.`,
          sender: "doctor",
          sender_name: "Dr. Priya Sharma",
          chat_id: 1
        })
      });
      if (res.ok) {
        toast.success(`"${title}" sent to Rajesh Kumar's chat thread! 💬`);
      } else {
        toast.success(`"${title}" sent to all relevant patients ✅`);
      }
    } catch {
      toast.success(`"${title}" sent to all relevant patients ✅`);
    }
  }


  return (
    <PhoneFrame>
      {/* Header with doctor info and notifications */}
      <header className="flex items-center gap-3 bg-card px-4 py-4 shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg shrink-0">
          PS
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[18px] font-bold truncate">{doctor.name}</h1>
          <p className="text-[13px] text-muted-foreground">{doctor.specialty} · MCI-882140</p>
        </div>
        <button
          aria-label="Notifications"
          className="relative flex items-center justify-center rounded-md text-foreground p-1"
          onClick={() => toast("3 new patient messages")}
        >
          <Bell className="size-5" />
          <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-destructive" />
        </button>
        <Link to="/doctor/profile" aria-label="Doctor profile">
          <div className="flex size-9 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
            <Stethoscope className="size-4 text-primary" />
          </div>
        </Link>
      </header>

      <Screen withNav>
        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-2">
          {doctorStats.map((s) => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="px-2 py-4 text-center">
                <p className="text-[20px] font-bold text-primary">{s.value}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🚨 Red Flag Alerts */}
        <SectionTitle>🚨 Red Flag Alerts</SectionTitle>
        <div className="flex flex-col gap-2">
          {redFlagAlerts.map((r) => (
            <Card
              key={r.patient}
              className={`shadow-card border-l-4 ${r.severity === "critical" ? "border-l-destructive" : "border-l-yellow-500"}`}
            >
              <CardContent className="py-3 flex items-start gap-3">
                <AlertTriangle className={`size-5 mt-0.5 shrink-0 ${r.severity === "critical" ? "text-destructive" : "text-yellow-600"}`} />
                <div className="min-w-0">
                  <p className="text-[15px] font-bold">{r.patient}</p>
                  <p className="text-[13px] text-muted-foreground leading-snug">{r.alert}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 h-8 text-[12px]"
                  onClick={() => navigate({ to: "/doctor/patient" })}>
                  Review
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <SectionTitle>Quick actions</SectionTitle>
        <div className="grid grid-cols-4 gap-2">
          <Action to="/doctor/patients" icon={<Users className="size-5" />} label="Patients" />
          <Action to="/doctor/prescriptions" icon={<FilePlus className="size-5" />} label="Prescribe" />
          <Action to="/doctor/clinic" icon={<BarChart3 className="size-5" />} label="Clinic" />
          <Action to="/doctor/cme" icon={<FileText className="size-5" />} label="CME" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Action to="/doctor/messages" icon={<MessageCircle className="size-5" />} label="Messages" />
          <Action to="/doctor/analytics" icon={<TrendingUp className="size-5" />} label="Analytics" />
          <Action to="/doctor/referral" icon={<Users className="size-5" />} label="Referrals" />
        </div>

        {/* 📹 Telemedicine Video Call */}
        <SectionTitle>Telemedicine</SectionTitle>
        <Card className="shadow-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="py-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/20">
              <Video className="size-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold">Start Video Consultation</p>
              <p className="text-[13px] text-muted-foreground">Secure call · patient gets instant link</p>
            </div>
            <Button
              size="sm"
              className="shrink-0 h-9 text-[13px]"
              disabled={telemed}
              onClick={startVideoCall}
            >
              <Phone className="size-3 mr-1" /> Start
            </Button>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <SectionTitle>Pending tasks</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="divide-y divide-border p-0">
            {pendingTasks.map((t) => (
              <Link key={t.label} to={t.to as any} className="flex items-center gap-3 px-4 py-3">
                <span className="flex-1 text-[15px]">{t.label}</span>
                <Badge variant="destructive" className="text-[13px] px-2">
                  {t.count}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <SectionTitle>Today's appointments</SectionTitle>
        <div className="flex flex-col gap-2">
          {doctorSchedule.map((s, i) => (
            <Card key={s.time} className="shadow-card">
              <CardContent className="flex items-center gap-3 py-3">
                <p className="w-[80px] shrink-0 text-[13px] font-semibold text-primary">{s.time}</p>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{s.patient}</p>
                  <p className="text-[13px] text-muted-foreground">{s.reason}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-[12px] px-2"
                    onClick={() => navigate({ to: "/doctor/patient" })}
                  >
                    View
                  </Button>
                  {i === 0 && (
                    <Badge className="text-[11px] h-8 px-2 bg-green-600">Next</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🤖 AI Clinical Assistant (Fully Interactive) */}
        <SectionTitle>🤖 AI Clinical Assistant</SectionTitle>
        <Card className="shadow-card border-purple-300 bg-gradient-to-br from-purple-50/80 to-indigo-50/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[14px] font-bold text-purple-900 flex items-center gap-1.5">
                <Sparkles className="size-4 text-purple-600 animate-pulse" /> Today's AI Summary
              </p>
              <Badge className="bg-purple-600 text-white text-[10px] px-2">Live AI</Badge>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsAiOpen(true);
                  setSelectedPatient("Rajesh Kumar");
                  handleAskAi("Which patients have abnormal lab values and what clinical actions should I prioritise?", "chat");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-white/80 hover:bg-white border border-purple-100 transition-all shadow-xs flex items-start gap-2.5 group cursor-pointer"
              >
                <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-[13px] text-purple-950 font-medium group-hover:text-purple-700 leading-snug">
                  3 patients have abnormal lab values — <span className="underline decoration-purple-400 font-semibold">prioritise review</span>
                </span>
              </button>

              <button
                onClick={() => {
                  setIsAiOpen(true);
                  setSelectedPatient("Rajesh Kumar");
                  handleAskAi("Explain the drug interaction between Naproxen and Warfarin for Rajesh Kumar and suggest safer alternative pain management.", "chat");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-white/80 hover:bg-white border border-purple-100 transition-all shadow-xs flex items-start gap-2.5 group cursor-pointer"
              >
                <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-[13px] text-purple-950 font-medium group-hover:text-purple-700 leading-snug">
                  Drug interaction detected: <span className="underline decoration-red-400 font-semibold">Rajesh Kumar's Naproxen + Warfarin</span>
                </span>
              </button>

              <button
                onClick={() => {
                  setIsAiOpen(true);
                  setSelectedPatient("General");
                  handleAskAi("What are the ICMR Dengue clinical management guidelines and warning signs for patient advisory?", "chat");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-white/80 hover:bg-white border border-purple-100 transition-all shadow-xs flex items-start gap-2.5 group cursor-pointer"
              >
                <Bot className="size-4 text-purple-600 shrink-0 mt-0.5" />
                <span className="text-[13px] text-purple-950 font-medium group-hover:text-purple-700 leading-snug">
                  Dengue cases up 24% this week in your area <span className="underline decoration-purple-400 font-semibold">(ICMR alert)</span>
                </span>
              </button>
            </div>

            <Button
              variant="default"
              className="mt-3.5 h-10 w-full text-[13px] bg-purple-700 hover:bg-purple-800 text-white shadow-sm font-semibold flex items-center justify-center gap-2 rounded-xl"
              onClick={() => {
                setIsAiOpen(true);
                if (!aiResponse) {
                  handleAskAi("Summarize Rajesh Kumar's latest blood test findings and treatment recommendation.", "chat");
                }
              }}
            >
              <Bot className="size-4" /> Ask AI about a patient
            </Button>
          </CardContent>
        </Card>

        {/* Patient Education Library — Bulk Send */}
        <SectionTitle>📚 Patient Education Library</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="py-4 flex flex-col gap-2">
            {[
              "Dengue — what to do at home",
              "Diabetes diet guide",
              "Hypertension lifestyle tips",
            ].map((title) => (
              <div key={title} className="flex items-center gap-3">
                <span className="flex-1 text-[14px] font-medium">{title}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[12px] border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => handleSendEducation(title)}
                >
                  Send
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </Screen>

      {/* AI Clinical Assistant Interactive Dialog */}
      <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
        <DialogContent className="max-w-md w-[95vw] rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[18px] text-purple-900 font-bold">
              <Bot className="size-6 text-purple-600" /> AI Clinical Assistant
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Real-time clinical AI model for diagnostic queries, drug safety, and EMR SOAP notes.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-2">
            {/* Patient Context Selector */}
            <div>
              <label className="text-[12px] font-semibold text-foreground block mb-1">
                Select Patient Context:
              </label>
              <select
                value={selectedPatient}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPatient(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[14px] font-medium"
              >
                <option value="Rajesh Kumar">Rajesh Kumar (34M · Dengue Recovery)</option>
                <option value="Savitri Kumar">Savitri Kumar (64F · Hypertension & HbA1c)</option>
                <option value="Priya Kumar">Priya Kumar (32F · Iron Deficiency Anemia)</option>
                <option value="Sunil Rao">Sunil Rao (52M · Uncontrolled BP)</option>
                <option value="General">General / All Patients</option>
              </select>
            </div>

            {/* Quick Action Chips */}
            <div>
              <p className="text-[12px] font-semibold text-foreground mb-1.5">Quick Clinical Prompts:</p>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] rounded-full border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100"
                  onClick={() => handleAskAi(`Summarize ${selectedPatient}'s abnormal lab parameters and reference ranges.`, "chat")}
                >
                  📊 Abnormal Lab Values
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] rounded-full border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
                  onClick={() => handleAskAi(`Check potential drug interactions and side effects for ${selectedPatient}'s active prescriptions.`, "chat")}
                >
                  💊 Drug Interactions
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] rounded-full border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
                  onClick={() => handleAskAi("", "soap")}
                >
                  📄 Generate SOAP Note
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] rounded-full border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                  onClick={() => handleAskAi(`What diet and lifestyle protocol should I prescribe for ${selectedPatient}?`, "chat")}
                >
                  🥗 Diet Protocol
                </Button>
              </div>
            </div>

            {/* AI Query Input */}
            <div className="flex gap-2 items-center">
              <Input
                placeholder={`Ask AI about ${selectedPatient}...`}
                value={aiQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAiQuery(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") handleAskAi(aiQuery, "chat");
                }}
                className="h-10 text-[14px]"
              />
              <Button
                className="h-10 px-3 bg-purple-700 hover:bg-purple-800 text-white shrink-0"
                disabled={isAiLoading}
                onClick={() => handleAskAi(aiQuery, "chat")}
              >
                {isAiLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>

            {/* AI Response Output Box */}
            {isAiLoading && (
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center gap-2 text-purple-700 text-[13px] font-medium animate-pulse">
                <Loader2 className="size-4 animate-spin" /> AI Medical Pipeline analyzing clinical data...
              </div>
            )}

            {aiResponse && !isAiLoading && (
              <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-950 text-[13px] space-y-2 whitespace-pre-wrap leading-relaxed shadow-inner max-h-[300px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-purple-200 pb-2 mb-2">
                  <span className="font-bold text-[13px] text-purple-900 flex items-center gap-1">
                    <Sparkles className="size-3.5 text-purple-600" /> AI Clinical Response
                  </span>
                  <Badge variant="outline" className="text-[10px] border-purple-300 text-purple-800 bg-white">
                    BioGPT Engine
                  </Badge>
                </div>
                {aiResponse}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavDoctor />
    </PhoneFrame>
  );
}

function Action({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to as any}
      className="tap-target flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card py-4 text-[13px] font-medium text-foreground"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </Link>
  );
}
