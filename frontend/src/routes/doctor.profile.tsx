import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  ChevronRight,
  FilePlus,
  Globe,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Star,
  Stethoscope,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { BottomNavDoctor, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
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
import { doctor } from "@/lib/medsimplify-data";

export const Route = createFileRoute("/doctor/profile")({
  head: () => ({
    meta: [
      { title: "Doctor profile — MedSimplify" },
      {
        name: "description",
        content: "Manage your doctor profile, availability, notifications and clinic settings in MedSimplify.",
      },
      { property: "og:title", content: "Doctor profile — MedSimplify" },
      { property: "og:description", content: "Your doctor workspace settings and profile." },
    ],
  }),
  component: DoctorProfile,
});

const credentials = [
  { label: "Registration ID", value: "MCI-882140" },
  { label: "Specialization", value: "General Medicine" },
  { label: "Experience", value: "14 years" },
  { label: "Clinic", value: "City Hospital, Mumbai" },
  { label: "Consultation Fee", value: "₹500" },
];

const stats = [
  { label: "Patients", value: "312" },
  { label: "Rating", value: "4.8★" },
  { label: "CME Credits", value: "18/30" },
];

function DoctorProfile() {
  const navigate = useNavigate();
  const [notifPatient, setNotifPatient] = useState(true);
  const [notifReport, setNotifReport] = useState(true);
  const [notifMsg, setNotifMsg] = useState(true);
  const [telemedEnabled, setTelemedEnabled] = useState(true);

  return (
    <PhoneFrame>
      <Screen withNav>
        {/* Profile Header */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-[24px] font-bold text-primary shrink-0">
                PS
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[20px] font-bold">{doctor.name}</p>
                <p className="text-[14px] text-muted-foreground">{doctor.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-[11px] px-2">MCI Verified ✓</Badge>
                  <Badge className="text-[11px] px-2 bg-green-600">Available</Badge>
                </div>
              </div>
              <Button variant="outline" className="h-9 text-[13px] shrink-0" onClick={() => toast("Edit profile")}>
                Edit
              </Button>
            </div>
            {/* Stats row */}
            <div className="mt-4 grid grid-cols-3 divide-x divide-border border rounded-xl">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center py-3">
                  <p className="text-[18px] font-bold text-primary">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Credentials */}
        <SectionTitle>Credentials</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="divide-y divide-border p-0">
            {credentials.map((c) => (
              <div key={c.label} className="flex items-center px-4 py-3 gap-3">
                <span className="text-[14px] text-muted-foreground w-36 shrink-0">{c.label}</span>
                <span className="text-[14px] font-medium flex-1">{c.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Doctor App Features */}
        <SectionTitle>Doctor Workspace</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="divide-y divide-border p-0">
            <RowLink to="/doctor/patients" icon={<Users className="size-5 text-primary" />} label="Patient Management" />
            <RowLink to="/doctor/prescriptions" icon={<FilePlus className="size-5 text-primary" />} label="Digital Prescriptions" />
            <RowLink to="/doctor/clinic" icon={<TrendingUp className="size-5 text-primary" />} label="Practice Analytics" />
            <RowLink to="/doctor/cme" icon={<BookOpen className="size-5 text-primary" />} label="CME Learning (18/30 credits)" />
            <RowLink to="/chat" icon={<MessageCircle className="size-5 text-primary" />} label="Secure Patient Messaging" />
            <RowLink to="/doctor/referral" icon={<ShieldCheck className="size-5 text-primary" />} label="Referral Management" />
          </CardContent>
        </Card>

        {/* Availability & Telemedicine */}
        <SectionTitle>Availability & Telemedicine</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="flex flex-col gap-4 pt-6">
            <label className="flex items-center justify-between gap-3 text-[15px]">
              <span className="flex items-center gap-2">
                <Video className="size-5 text-primary" /> Telemedicine consultations
              </span>
              <Switch
                checked={telemedEnabled}
                onCheckedChange={(val: boolean) => {
                  setTelemedEnabled(val);
                  toast(val ? "Telemedicine enabled — patients can book video calls" : "Telemedicine paused");
                }}
                aria-label="Telemedicine toggle"
              />
            </label>
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-medium">Consultation hours</p>
              <div className="grid grid-cols-2 gap-2">
                {["Mon–Fri: 9AM–1PM", "Sat: 9AM–12PM", "Sun: Closed", "Emergency: Available"].map((h) => (
                  <span key={h} className="rounded-lg border border-border px-3 py-2 text-[13px]">{h}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <SectionTitle>Notifications</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="flex flex-col gap-4 pt-6">
            <label className="flex items-center justify-between gap-3 text-[15px]">
              <span className="flex items-center gap-2">
                <Bell className="size-5 text-primary" /> New patient bookings
              </span>
              <Switch checked={notifPatient} onCheckedChange={setNotifPatient} aria-label="Patient booking notifications" />
            </label>
            <label className="flex items-center justify-between gap-3 text-[15px]">
              <span className="flex items-center gap-2">
                <Bell className="size-5 text-primary" /> Lab report arrivals
              </span>
              <Switch checked={notifReport} onCheckedChange={setNotifReport} aria-label="Lab report notifications" />
            </label>
            <label className="flex items-center justify-between gap-3 text-[15px]">
              <span className="flex items-center gap-2">
                <Bell className="size-5 text-primary" /> Patient messages
              </span>
              <Switch checked={notifMsg} onCheckedChange={setNotifMsg} aria-label="Message notifications" />
            </label>
          </CardContent>
        </Card>

        {/* Language */}
        <SectionTitle>Preferences</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <label className="mb-2 flex items-center gap-2 text-[15px]" htmlFor="doc-lang">
              <Globe className="size-5 text-primary" /> Interface language
            </label>
            <Select defaultValue="en" onValueChange={(v: string) => toast(`Language set to ${v.toUpperCase()}`)}>
              <SelectTrigger id="doc-lang" className="h-12 text-[15px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Account actions */}
        <SectionTitle>Account</SectionTitle>
        <div className="flex flex-col gap-3 pb-6">
          <Button
            variant="outline"
            className="h-12 w-full justify-start text-[15px]"
            onClick={() => {
              localStorage.removeItem("medsimplify_token");
              toast("Signed out");
              navigate({ to: "/doctor" });
            }}
          >
            <LogOut className="size-4 mr-2" /> Sign out
          </Button>
          <Link
            to="/login"
            className="tap-target flex items-center justify-center rounded-md text-[14px] text-muted-foreground underline"
          >
            Switch to patient app
          </Link>
        </div>
      </Screen>
      <BottomNavDoctor />
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
    <Link to={to} className="tap-target flex items-center gap-3 px-4 py-3 text-[15px]">
      {icon}
      <span className="flex-1">{label}</span>
      <ChevronRight className="size-5 text-muted-foreground" />
    </Link>
  );
}
