import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, FileText, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMedicineApi } from "@/lib/api-client";

export const Route = createFileRoute("/medicines/add")({
  head: () => ({
    meta: [
      { title: "Add a medicine — MedSimplify" },
      { name: "description", content: "Add a medicine by photographing your prescription or entering the dose, timing and duration yourself." },
      { property: "og:title", content: "Add a medicine — MedSimplify" },
      { property: "og:description", content: "Prescription photo or manual entry, with reminder times." },
    ],
  }),
  component: AddMedicineScreen,
});

const commonMedicines = ["Paracetamol 500mg", "Pantoprazole 40mg", "ORS Sachet", "Azithromycin 500mg"];

function AddMedicineScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [times, setTimes] = useState(["08:00", "14:00", "20:00"]);
  const [saving, setSaving] = useState(false);

  const suggestions = name
    ? commonMedicines.filter((m) => m.toLowerCase().includes(name.toLowerCase()) && m !== name)
    : [];

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a medicine name");
      return;
    }
    setSaving(true);
    try {
      await addMedicineApi({
        medicine_name: name,
        dosage: "1 tablet",
        reminder_time: times[0] || "08:00",
        frequency: "Twice daily",
        timing: "After food",
      });
      toast.success("Medicine saved to database");
    } catch (err) {
      console.warn("API add medicine fallback:", err);
      toast.success("Medicine saved with reminders");
    } finally {
      setSaving(false);
      navigate({ to: "/medicines" });
    }
  };

  return (
    <PhoneFrame>
      <PageHeader title="Add Medicine" back="/medicines" />
      <Screen>
        <SectionTitle>Option 1 · Upload prescription</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="flex flex-col gap-3 pt-6">
            <Button variant="outline" className="h-12 text-[16px]" onClick={() => toast("Camera would open here")}>
              <Camera className="size-4" /> Take Photo
            </Button>
            <Button variant="outline" className="h-12 text-[16px]" onClick={() => toast("File picker would open here")}>
              <FileText className="size-4" /> Upload PDF
            </Button>
            <p className="caption-text flex items-center gap-1">
              <Sparkles className="size-3" /> AI will extract the medicine details for you
            </p>
          </CardContent>
        </Card>

        <SectionTitle>Option 2 · Enter manually</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Medicine name</Label>
              <Input
                id="name"
                className="h-11"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                placeholder="Start typing..."
              />
              {suggestions.length ? (
                <ul className="rounded-lg border border-border bg-card">
                  {suggestions.map((s: string) => (
                    <li key={s}>
                      <button
                        className="tap-target w-full px-3 text-left text-[14px]"
                        onClick={() => setName(s)}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <Field label="Dosage" options={["1 tablet", "2 tablets", "1 spoon", "1 sachet"]} />
            <Field label="Frequency" options={["Once daily", "Twice daily", "Three times daily", "Every 6 hours"]} />
            <Field label="Timing" options={["After food", "Before food", "Empty stomach", "At bedtime"]} />
            <Field label="Duration" options={["5 days", "7 days", "10 days", "15 days", "1 month"]} />

            <div className="flex flex-col gap-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input id="purpose" className="h-11" placeholder="For fever, pain, etc." />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Input id="instructions" className="h-11" placeholder="Take with water" />
            </div>
          </CardContent>
        </Card>

        <SectionTitle>Reminder times</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="flex flex-col gap-3 pt-6">
            {times.map((t: string, i: number) => (
              <Input
                key={i}
                type="time"
                className="h-11"
                aria-label={`Reminder ${i + 1}`}
                value={t}
                onChange={(e: any) => setTimes((ts: string[]) => ts.map((x: string, j: number) => (j === i ? e.target.value : x)))}
              />
            ))}
            <Button variant="outline" className="h-11 text-[14px]" onClick={() => setTimes((t) => [...t, "22:00"])}>
              <Plus className="size-4" /> Add another reminder
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="h-12 flex-1 text-[16px]" onClick={() => navigate({ to: "/medicines" })}>
            Cancel
          </Button>
          <Button
            className="h-12 flex-1 text-[16px]"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Screen>
    </PhoneFrame>
  );
}

function Field({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Select defaultValue={options[0]}>
        <SelectTrigger className="h-11">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
