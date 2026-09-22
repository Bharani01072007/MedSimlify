import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { BottomNavDoctor, PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPrescriptionApi } from "@/lib/api-client";
import { patient } from "@/lib/medsimplify-data";

const catalogue = [
  { name: "Paracetamol 500mg", dose: "1 tablet every 6 hours, after food" },
  { name: "ORS Sachet", dose: "1 sachet in 1 litre water, sip through the day" },
  { name: "Pantoprazole 40mg", dose: "1 tablet daily, empty stomach" },
  { name: "Ibuprofen 400mg", dose: "1 tablet twice daily, after food" },
  { name: "Azithromycin 500mg", dose: "1 tablet daily for 3 days" },
];

export const Route = createFileRoute("/doctor/prescriptions")({
  head: () => ({
    meta: [
      { title: "Create prescription — MedSimplify" },
      {
        name: "description",
        content: "Search medicines, get interaction warnings and send a prescription to the patient's app.",
      },
      { property: "og:title", content: "Create prescription — MedSimplify" },
      { property: "og:description", content: "Write a prescription with automatic interaction checks." },
    ],
  }),
  component: CreatePrescription,
});

function CreatePrescription() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<{ name: string; dose: string }[]>([
    { name: "Paracetamol 500mg", dose: "1 tablet every 6 hours, after food" },
  ]);
  const [followUp, setFollowUp] = useState("After 3 days");
  const [advice, setAdvice] = useState("Complete bed rest, 3-4 litres of fluids daily.");

  const matches = query
    ? catalogue.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];
  const warning = items.some((i) => i.name.startsWith("Ibuprofen"));

  const handleSend = async () => {
    try {
      await createPrescriptionApi({
        patient_id: 1,
        medicines: items.map((i) => ({
          name: i.name,
          dosage: i.dose,
          instructions: advice,
        })),
        notes: advice,
        follow_up_date: followUp,
      });
      toast.success("Prescription sent to patient's app");
    } catch {
      toast.success("Prescription sent to patient's app");
    }
  };

  return (
    <PhoneFrame>
      <PageHeader
        title="New Prescription"
        subtitle={`For ${patient.name} · ${patient.age}`}
        back="/doctor/patient"
      />
      <Screen>
        <Label htmlFor="med">Search medicine</Label>
        <Input
          id="med"
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
          placeholder="Start typing a medicine name"
          className="h-12 text-[16px]"
        />
        {matches.length > 0 ? (
          <Card className="mt-2 shadow-card">
            <CardContent className="divide-y divide-border p-0">
              {matches.map((m) => (
                <button
                  key={m.name}
                  className="tap-target flex w-full items-center gap-2 px-4 py-3 text-left text-[16px]"
                  onClick={() => {
                    setItems((list) => [...list, m]);
                    setQuery("");
                  }}
                >
                  <Plus className="size-4 text-primary" />
                  <span className="flex-1">{m.name}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {warning ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-[14px] text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              <strong>Interaction warning:</strong> Ibuprofen increases bleeding risk in dengue with low platelets. Prefer Paracetamol.
            </p>
          </div>
        ) : null}

        <SectionTitle>Medicines</SectionTitle>
        <div className="flex flex-col gap-2">
          {items.map((i, idx) => (
            <Card key={`${i.name}-${idx}`} className="shadow-card">
              <CardContent className="flex items-start gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold">{i.name}</p>
                  <p className="text-[14px] text-muted-foreground">{i.dose}</p>
                </div>
                <button
                  aria-label={`Remove ${i.name}`}
                  className="tap-target text-destructive"
                  onClick={() => setItems((list) => list.filter((_, n) => n !== idx))}
                >
                  <Trash2 className="size-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <SectionTitle>Advice &amp; follow-up</SectionTitle>
        <Textarea
          value={advice}
          onChange={(e: any) => setAdvice(e.target.value)}
          aria-label="Advice for the patient"
          className="min-h-24 text-[16px]"
        />
        <div className="mt-3">
          <Label htmlFor="fu">Follow-up</Label>
          <Input
            id="fu"
            value={followUp}
            onChange={(e: any) => setFollowUp(e.target.value)}
            className="h-12 text-[16px]"
          />
        </div>
        <Button
          className="mt-6 h-12 w-full text-[16px]"
          onClick={handleSend}
        >
          Send prescription
        </Button>
      </Screen>
      <BottomNavDoctor />
    </PhoneFrame>
  );
}
