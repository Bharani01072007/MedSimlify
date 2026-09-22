import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  ChevronRight,
  FileText,
  Globe,
  HeartPulse,
  LogOut,
  Pill,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { BottomNav, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { patient as seedPatient } from "@/lib/medsimplify-data";
import { getPatientProfileApi } from "@/lib/api-client";
import { useAppLanguage, SUPPORTED_LANGUAGES } from "@/lib/language";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & settings — MedSimplify" },
      {
        name: "description",
        content: "Your details, family members, language, reminders and privacy settings in MedSimplify.",
      },
      { property: "og:title", content: "Profile & settings — MedSimplify" },
      { property: "og:description", content: "Manage your account, language and reminder settings." },
    ],
  }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const navigate = useNavigate();
  const [language, setLanguage] = useAppLanguage();
  const [profile, setProfile] = useState<any>(seedPatient);
  const [reminders, setReminders] = useState(true);
  const [reportAlerts, setReportAlerts] = useState(true);
  const [wearableSync, setWearableSync] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const live = await getPatientProfileApi(1);
        if (live && live.name) {
          setProfile(live);
        }
      } catch (err) {
        console.warn("API load patient profile fallback:", err);
      }
    }
    loadProfile();
  }, []);

  return (
    <PhoneFrame>
      <Screen withNav>
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-[20px] font-bold text-primary">
              {(profile.name || "R").charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[20px] font-bold">{profile.name}</p>
              <p className="text-[14px] text-muted-foreground">
                {profile.age || "38M"} · {profile.bloodGroup || "B+"} · {profile.phone || "+91-9876543210"}
              </p>
            </div>
            <Button variant="outline" className="h-11 text-[14px]" onClick={() => toast("Edit profile")}>
              Edit
            </Button>
          </CardContent>
        </Card>
        <SectionTitle>Health & Services</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="divide-y divide-border p-0">
            <RowLink to="/family" icon={<Users className="size-5 text-primary" />} label="Family members" />
            <RowLink to="/symptoms" icon={<HeartPulse className="size-5 text-primary" />} label="Symptom tracker" />
            <RowLink to="/pharmacy" icon={<Pill className="size-5 text-primary" />} label="Order medicines & generic finder" />
            <RowLink to="/lab-booking" icon={<BarChart3 className="size-5 text-primary" />} label="Book lab tests" />
            <RowLink to="/insurance" icon={<FileText className="size-5 text-primary" />} label="Insurance claim support" />
            <RowLink to="/emergency" icon={<ShieldCheck className="size-5 text-primary" />} label="Emergency info & ICE card" />
          </CardContent>
        </Card>
        <SectionTitle>Device & Notifications</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="flex flex-col gap-4 pt-6">
            <label className="flex items-center justify-between gap-3 text-[16px]">
              <span className="flex items-center gap-2">
                <HeartPulse className="size-5 text-primary" /> Smartwatch & Wearables sync
              </span>
              <Switch checked={wearableSync} onCheckedChange={(val: boolean) => { setWearableSync(val); toast(val ? "Fitbit & Apple Watch sync connected ⌚" : "Wearables sync paused"); }} aria-label="Smartwatch sync" />
            </label>
            <label className="flex items-center justify-between gap-3 text-[16px]">
              <span className="flex items-center gap-2">
                <Bell className="size-5 text-primary" /> Medicine reminders
              </span>
              <Switch checked={reminders} onCheckedChange={setReminders} aria-label="Medicine reminders" />
            </label>
            <label className="flex items-center justify-between gap-3 text-[16px]">
              <span className="flex items-center gap-2">
                <Bell className="size-5 text-primary" /> Report ready alerts
              </span>
              <Switch checked={reportAlerts} onCheckedChange={setReportAlerts} aria-label="Report alerts" />
            </label>
          </CardContent>
        </Card>
        <SectionTitle>Preferences</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <label className="mb-2 flex items-center gap-2 text-[16px]" htmlFor="lang">
              <Globe className="size-5 text-primary" /> App language
            </label>
            <Select value={language} onValueChange={(v: string) => { setLanguage(v); toast(`App language changed to ${SUPPORTED_LANGUAGES.find(l => l.code === v)?.name || v.toUpperCase()}`); }}>
              <SelectTrigger id="lang" className="h-12 text-[16px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.nativeName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <SectionTitle>Account</SectionTitle>
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="h-12 w-full justify-start text-[16px]"
            onClick={() => {
              toast("Signed out");
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="size-4" /> Log out
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full justify-start border-destructive text-[16px] text-destructive"
            onClick={() => toast.error("Account deletion needs email confirmation")}
          >
            <Trash2 className="size-4" /> Delete account
          </Button>
          <Link
            to="/doctor"
            className="tap-target flex items-center justify-center rounded-md text-[14px] text-muted-foreground underline"
          >
            Switch to doctor app
          </Link>
        </div>
      </Screen>
      <BottomNav />
    </PhoneFrame>
  );
}

function RowLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link to={to} className="tap-target flex items-center gap-3 px-4 py-3 text-[16px]">
      {icon}
      <span className="flex-1">{label}</span>
      <ChevronRight className="size-5 text-muted-foreground" />
    </Link>
  );
}
