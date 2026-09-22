import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
  MessageCircle,
  Pill,
  ShieldAlert,
  Sparkles,
  Upload,
} from "lucide-react";

import { useEffect, useState } from "react";
import { BottomNav, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAdherenceApi, getReportsApi } from "@/lib/api-client";
import { useUnreadChatCount } from "@/lib/chat-notifications";
import { patient } from "@/lib/medsimplify-data";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — MedSimplify" },
      { name: "description", content: "Your health at a glance: today's medicines, recent reports and upcoming appointments." },
      { property: "og:title", content: "Home — MedSimplify" },
      { property: "og:description", content: "Today's medicines, recent reports and appointments in one place." },
    ],
  }),
  component: HomeScreen,
});

const quickActions = [
  { to: "/upload", label: "Upload Report", icon: Upload, primary: true },
  { to: "/reports", label: "My Reports", icon: FileText, primary: false },
  { to: "/medicines", label: "Medicines", icon: Pill, primary: false },
  { to: "/appointments", label: "Appointments", icon: CalendarDays, primary: false },
] as const;

const shortcuts = [
  { to: "/symptoms", label: "Track symptoms", icon: ClipboardList },
  { to: "/assistant", label: "Health assistant", icon: Sparkles },
  { to: "/chat", label: "Chat with doctor", icon: MessageCircle },
  { to: "/emergency", label: "Emergency info", icon: ShieldAlert },
  { to: "/pharmacy", label: "Order medicines", icon: Pill },
  { to: "/lab-booking", label: "Book lab tests", icon: Activity },
  { to: "/insurance", label: "Insurance claim", icon: FileText },
] as const;

function HomeScreen() {
  const unreadCount = useUnreadChatCount();
  const [latestReport, setLatestReport] = useState<any>(null);
  const [adherence, setAdherence] = useState<{ score: number; taken: number; total: number }>({
    score: 75,
    taken: 3,
    total: 4,
  });

  useEffect(() => {
    async function loadHomeData() {
      try {
        const reports = await getReportsApi(1);
        if (Array.isArray(reports) && reports.length > 0) {
          setLatestReport(reports[0]);
        }
        const adh = await getAdherenceApi(1);
        if (adh && typeof adh.score === "number") {
          setAdherence(adh);
        }
      } catch (err) {
        console.warn("Home adherence fetch warning:", err);
      }
    }
    loadHomeData();
  }, []);
  return (
    <PhoneFrame>
      <header className="flex items-center gap-3 bg-card px-4 py-4">
        <div className="min-w-0 flex-1">
          <h1 className="truncate">Good Morning, {patient.firstName}! 👋</h1>
          <p className="text-[14px] text-muted-foreground">How are you feeling today?</p>
        </div>
        <Link to="/chat" aria-label="Chat notifications" className="tap-target relative flex items-center justify-center rounded-md text-foreground">
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          ) : (
            <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />
          )}
        </Link>
        <Link to="/profile" aria-label="Profile">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary text-primary-foreground">RK</AvatarFallback>
          </Avatar>
        </Link>
      </header>

      <Screen withNav>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ to, label, icon: Icon, primary }) => (
            <Link
              key={to}
              to={to}
              className={
                primary
                  ? "tap-target flex flex-col justify-between rounded-xl bg-primary p-4 text-primary-foreground shadow-sm"
                  : "tap-target flex flex-col justify-between rounded-xl border border-border bg-card p-4 text-foreground shadow-card"
              }
            >
              <div className="flex items-center justify-between">
                <Icon className={primary ? "size-6" : "size-6 text-primary"} />
                <ArrowRight className="size-4 opacity-70" />
              </div>
              <span className="mt-4 text-[15px] font-semibold leading-tight">{label}</span>
            </Link>
          ))}
        </div>

        {/* Latest report summary card */}
        <Card className="mt-4 border-l-4 border-l-primary shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
            <CardTitle className="text-[16px] font-semibold text-foreground">
              📊 Latest Report
            </CardTitle>
            <Badge variant="secondary">Recent</Badge>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-[15px] font-medium text-foreground">
              {latestReport?.file_name || "Metropolis Complete Blood Count (CBC)"}
            </p>
            <p className="caption-text mt-1">
              Dengue NS1 Positive · Platelets 80,000 /uL (Low)
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[13px] text-muted-foreground">Action: Hydration & Rest</span>
              <Link to="/reports" className="text-[13px] font-semibold text-primary hover:underline">
                View Details →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Medication Adherence Summary */}
        <Card className="mt-4 shadow-card">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-[16px] font-semibold text-foreground">
              💊 Today's Medication Adherence
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-foreground">3 of 4 doses taken today</p>
                <p className="text-[12px] text-muted-foreground">Next: Paracetamol 650mg at 9:00 PM</p>
              </div>
              <Link to="/medicines" className="text-[13px] font-semibold text-primary hover:underline">
                View Rx →
              </Link>
            </div>
          </CardContent>
        </Card>

        <SectionTitle>Recent activity</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="flex flex-col gap-3 pt-6">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-[16px] font-medium">
                  Last uploaded: {latestReport?.simplified_summary?.title || latestReport?.file_name || "CBC Report"}
                </p>
                <p className="caption-text">
                  {latestReport?.created_at?.split("T")[0] || "2 hours ago"} · {latestReport?.simplified_summary?.flagged_reason || "Report Ready"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-[16px] font-medium">Next appointment: Tomorrow, 10 AM</p>
                <p className="caption-text">Dr. Priya Sharma · City Hospital</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="mt-0.5 size-5 text-success" />
              <div>
                <p className="text-[16px] font-medium">Fever improving: 100.4°F today</p>
                <p className="caption-text">Down 1.3°F since yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <SectionTitle>Shortcuts</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="tap-target flex items-center gap-2 rounded-xl bg-card p-3 text-[14px] font-medium shadow-card"
            >
              <Icon className="size-5 text-primary" />
              {label}
            </Link>
          ))}
        </div>
      </Screen>

      <BottomNav />
    </PhoneFrame>
  );
}
