import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, FilePlus, Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { BottomNavDoctor, PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/doctor/referral")({
  head: () => ({
    meta: [
      { title: "Referral Management — MedSimplify Doctor" },
      {
        name: "description",
        content: "Create specialist referral letters, attach patient reports, and track referral status.",
      },
    ],
  }),
  component: ReferralScreen,
});

const existingReferrals = [
  {
    id: "r1",
    patient: "Rajesh Kumar",
    specialist: "Dr. Arvind Kapoor",
    specialty: "Hematologist",
    date: "18-Sep-2026",
    status: "Pending",
    notes: "CBC shows persistent thrombocytopenia. Dengue follow-up.",
  },
  {
    id: "r2",
    patient: "Meena Iyer",
    specialist: "Dr. Lakshmi Rao",
    specialty: "Endocrinologist",
    date: "12-Sep-2026",
    status: "Accepted",
    notes: "HbA1c 9.2% — uncontrolled Type 2 diabetes, medication review needed.",
  },
  {
    id: "r3",
    patient: "Sunil Rao",
    specialist: "Dr. Bose",
    specialty: "Cardiologist",
    date: "10-Sep-2026",
    status: "Completed",
    notes: "Hypertension 170/110, possible secondary cause.",
  },
];

function statusBadgeVariant(status: string) {
  if (status === "Pending") return "secondary";
  if (status === "Accepted") return "default";
  return "outline";
}

function ReferralScreen() {
  const [showForm, setShowForm] = useState(false);
  const [patientName, setPatientName] = useState("Rajesh Kumar");
  const [specialist, setSpecialist] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [notes, setNotes] = useState("");

  function submitReferral(e: any) {
    e.preventDefault();
    if (!specialist || !specialty) return toast.error("Please fill specialist name and specialty.");
    toast.success(`✅ Referral letter for ${patientName} → ${specialist} (${specialty}) created & sent!`);
    setShowForm(false);
    setSpecialist("");
    setSpecialty("");
    setNotes("");
  }

  return (
    <PhoneFrame>
      <PageHeader
        title="Referral Management"
        back="/doctor/dashboard"
        right={
          <Button
            size="sm"
            variant={showForm ? "outline" : "default"}
            className="h-9 text-[13px]"
            onClick={() => setShowForm((v) => !v)}
          >
            <FilePlus className="size-4 mr-1" />
            {showForm ? "Cancel" : "New Referral"}
          </Button>
        }
      />
      <Screen withNav>
        {showForm && (
          <Card className="shadow-card mb-4 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-[16px] font-bold mb-4">Create Referral Letter</p>
              <form className="flex flex-col gap-4" onSubmit={submitReferral}>
                <div>
                  <Label htmlFor="ref-patient">Patient</Label>
                  <Input
                    id="ref-patient"
                    value={patientName}
                    onChange={(e: any) => setPatientName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="ref-specialist">Specialist Name</Label>
                  <Input
                    id="ref-specialist"
                    value={specialist}
                    onChange={(e: any) => setSpecialist(e.target.value)}
                    placeholder="e.g. Dr. Arvind Kapoor"
                    className="h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="ref-specialty">Specialty</Label>
                  <Input
                    id="ref-specialty"
                    value={specialty}
                    onChange={(e: any) => setSpecialty(e.target.value)}
                    placeholder="e.g. Hematologist, Cardiologist"
                    className="h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="ref-notes">Clinical Reason / Notes</Label>
                  <Textarea
                    id="ref-notes"
                    value={notes}
                    onChange={(e: any) => setNotes(e.target.value)}
                    placeholder="Reason for referral and relevant clinical findings…"
                    className="min-h-24 text-[15px]"
                  />
                </div>
                <Button type="submit" className="h-12 text-[15px]">
                  <Send className="size-4 mr-2" /> Send Referral Letter
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <SectionTitle>Active Referrals</SectionTitle>
        <div className="flex flex-col gap-3">
          {existingReferrals.map((r) => (
            <Card key={r.id} className="shadow-card">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-bold">{r.patient}</p>
                    <p className="text-[14px] text-primary font-medium">→ {r.specialist} ({r.specialty})</p>
                    <p className="text-[13px] text-muted-foreground mt-1">{r.notes}</p>
                    <p className="text-[12px] text-muted-foreground mt-1">{r.date}</p>
                  </div>
                  <Badge variant={statusBadgeVariant(r.status)} className="shrink-0 text-[12px]">
                    {r.status}
                  </Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-[12px]"
                    onClick={() => toast(`Downloading referral letter for ${r.patient}…`)}
                  >
                    Download PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-[12px]"
                    onClick={() => toast(`Reminder sent to ${r.specialist}`)}
                  >
                    Send Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Screen>
      <BottomNavDoctor />
    </PhoneFrame>
  );
}
