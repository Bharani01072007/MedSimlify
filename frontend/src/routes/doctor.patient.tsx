import { createFileRoute, Link } from "@tanstack/react-router";
import { FilePlus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { PageHeader, PhoneFrame, Screen } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { medicines, patient, reports } from "@/lib/medsimplify-data";

export const Route = createFileRoute("/doctor/patient")({
  head: () => ({
    meta: [
      { title: "Patient record — MedSimplify" },
      {
        name: "description",
        content: "Full patient record: lab reports, current prescriptions, visit history and clinical notes.",
      },
      { property: "og:title", content: "Patient record — MedSimplify" },
      { property: "og:description", content: "Reports, prescriptions, history and notes in one record." },
    ],
  }),
  component: DoctorPatientProfile,
});

function DoctorPatientProfile() {
  const [tab, setTab] = useState("reports");
  const [note, setNote] = useState("");

  return (
    <PhoneFrame>
      <PageHeader
        title={patient.name}
        subtitle={`${patient.age} · ${patient.bloodGroup} · Dengue fever`}
        back="/doctor/patients"
      />
      <Screen>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="rx">Rx</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 flex flex-col gap-2">
          {tab === "reports" &&
            reports.map((r) => (
              <Card key={r.id} className="shadow-card">
                <CardContent className="py-4">
                  <div className="flex items-center gap-2">
                    <p className="flex-1 text-[16px] font-semibold">{r.title}</p>
                    <Badge variant="secondary">{r.type}</Badge>
                  </div>
                  <p className="text-[14px] text-muted-foreground">
                    {r.date} · {r.keyFinding}
                  </p>
                  {r.abnormal ? (
                    <p className="text-[14px] font-semibold text-destructive">{r.abnormal}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}

          {tab === "rx" &&
            medicines.map((m) => (
              <Card key={m.id} className="shadow-card">
                <CardContent className="py-4">
                  <p className="text-[16px] font-semibold">{m.name}</p>
                  <p className="text-[14px] text-muted-foreground">
                    {m.dosage} · {m.timing} · day {m.dayOf} of {m.totalDays}
                  </p>
                </CardContent>
              </Card>
            ))}

          {tab === "history" && (
            <Card className="shadow-card">
              <CardContent className="py-4 text-[16px]">
                <ul className="list-disc pl-5">
                  <li>13-Sep-2026 — Dengue diagnosed, treatment started</li>
                  <li>28-Aug-2026 — Viral fever consultation</li>
                  <li>12-Aug-2026 — Discharged after viral fever</li>
                  <li>Known allergies: {patient.allergies}</li>
                </ul>
              </CardContent>
            </Card>
          )}

          {tab === "notes" && (
            <Card className="shadow-card">
              <CardContent className="py-4">
                <Textarea
                  value={note}
                  onChange={(e: any) => setNote(e.target.value)}
                  placeholder="Clinical notes for this visit..."
                  aria-label="Clinical notes"
                  className="min-h-32 text-[16px]"
                />
                <Button
                  className="mt-3 h-12 w-full text-[16px]"
                  onClick={() => toast.success("Note saved")}
                >
                  Save note
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Button asChild className="mt-6 h-12 w-full text-[16px]">
          <Link to="/doctor/prescriptions">
            <FilePlus className="size-4" /> Create prescription
          </Link>
        </Button>
      </Screen>
    </PhoneFrame>
  );
}
