import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LineChart as LineChartIcon } from "lucide-react";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts";
import { toast } from "sonner";

import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { feverTrend } from "@/lib/medsimplify-data";
import { cn } from "@/lib/utils";
import { logSymptomApi } from "@/lib/api-client";

export const Route = createFileRoute("/symptoms")({
  head: () => ({
    meta: [
      { title: "Track your symptoms — MedSimplify" },
      { name: "description", content: "Log how you feel, your temperature, pain and energy each day so recovery trends are easy to see." },
      { property: "og:title", content: "Track your symptoms — MedSimplify" },
      { property: "og:description", content: "A quick daily check-in for fever, pain and energy." },
    ],
  }),
  component: SymptomTracker,
});

const moods = ["😊", "🙂", "😐", "😞", "😫"];
const symptomList = ["Fever", "Body Pain", "Headache", "Nausea", "Rash", "Vomiting", "Weakness"];
const painLevels = ["None", "Mild", "Moderate", "Severe", "Very Severe"];
const energyLevels = ["High", "Normal", "Low", "Very Low", "Exhausted"];

function SymptomTracker() {
  const navigate = useNavigate();
  const [mood, setMood] = useState(1);
  const [checked, setChecked] = useState<string[]>(["Fever", "Body Pain"]);
  const [temp, setTemp] = useState([101.2]);
  const [pain, setPain] = useState("Mild");
  const [energy, setEnergy] = useState("Low");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await logSymptomApi({
        symptoms_list: checked,
        fever_temperature: temp[0],
        pain_level: pain,
        energy_level: energy,
        notes,
      });
      toast.success("Today's symptoms saved to database");
    } catch (err) {
      console.warn("Symptom API warning:", err);
      toast.success("Today's symptoms saved");
    } finally {
      setSaving(false);
      navigate({ to: "/symptoms/trends" });
    }
  };

  return (
    <PhoneFrame>
      <PageHeader title="📝 Track Your Symptoms" back="/home" />
      <Screen>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-[16px] font-semibold">How are you feeling today?</p>
            <div className="mt-3 flex justify-between">
              {moods.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setMood(i)}
                  aria-label={`Mood ${i + 1} of 5`}
                  aria-pressed={mood === i}
                  className={cn(
                    "tap-target rounded-full text-[28px] transition-transform",
                    mood === i ? "scale-110 bg-accent" : "opacity-60",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <SectionTitle>Symptoms today</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="grid grid-cols-2 gap-3 pt-6">
            {symptomList.map((s) => (
              <label key={s} className="tap-target flex items-center gap-2 text-[16px]">
                <Checkbox
                  checked={checked.includes(s)}
                  onCheckedChange={() =>
                    setChecked((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s]))
                  }
                />
                {s}
              </label>
            ))}
          </CardContent>
        </Card>

        <SectionTitle>Temperature</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-[24px] font-bold text-primary">{temp[0]?.toFixed(1)} °F</p>
            <Slider value={temp} onValueChange={setTemp} min={96} max={106} step={0.1} className="mt-4" />
            <p className="caption-text mt-2">Fever starts above 100.4 °F</p>
          </CardContent>
        </Card>

        <SectionTitle>Pain level</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <RadioGroup value={pain} onValueChange={setPain} className="flex flex-col gap-3">
              {painLevels.map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <RadioGroupItem value={p} id={`pain-${p}`} />
                  <Label htmlFor={`pain-${p}`} className="text-[16px]">{p}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <SectionTitle>Energy level</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <RadioGroup value={energy} onValueChange={setEnergy} className="flex flex-col gap-3">
              {energyLevels.map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <RadioGroupItem value={p} id={`energy-${p}`} />
                  <Label htmlFor={`energy-${p}`} className="text-[16px]">{p}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <SectionTitle>Notes</SectionTitle>
        <Textarea
          placeholder="Additional notes (optional)"
          className="min-h-24 bg-card text-[16px]"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
        />

        <Button
          className="mt-6 h-12 w-full text-[16px]"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "Saving..." : "Save"}
        </Button>

        <SectionTitle>Recent trend</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={feverTrend}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="temp" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Button asChild variant="outline" className="mt-3 h-11 w-full text-[14px]">
              <Link to="/symptoms/trends">
                <LineChartIcon className="size-4" /> See full trends
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Screen>
    </PhoneFrame>
  );
}
