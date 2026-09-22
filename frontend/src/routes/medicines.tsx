import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Pencil, Pill, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { BottomNav, EmptyState, PageHeader, PhoneFrame, Screen } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { medicines as seed } from "@/lib/medsimplify-data";
import { getMedicinesApi } from "@/lib/api-client";

export const Route = createFileRoute("/medicines")({
  head: () => ({
    meta: [
      { title: "My medicines — MedSimplify" },
      { name: "description", content: "Track every medicine, dose timing and course progress, with reminders for the next dose." },
      { property: "og:title", content: "My medicines — MedSimplify" },
      { property: "og:description", content: "Doses, timings and reminders in one place." },
    ],
  }),
  component: MedicinesScreen,
});

function MedicinesScreen() {
  const [list, setList] = useState(seed);
  const [tab, setTab] = useState("active");

  useEffect(() => {
    async function loadMedicines() {
      try {
        const live = await getMedicinesApi(1);
        if (Array.isArray(live) && live.length > 0) {
          const mapped = live.map((m: any, index: number) => ({
            id: String(m.id || index + 1),
            name: m.medicine_name || m.name || "Medicine",
            dosage: m.dosage || "1 tablet",
            timing: m.timing || "After food",
            purpose: m.purpose || "Health supplement",
            dayOf: m.dayOf || 3,
            totalDays: m.totalDays || 7,
            next: m.reminder_time || m.next || "8:00 AM",
            active: m.is_active !== false,
            completed: m.completed || false,
          }));
          setList(mapped);
        }
      } catch (err) {
        console.warn("API load medicines fallback:", err);
      }
    }
    loadMedicines();
  }, []);

  const shown = list.filter((m) =>
    tab === "active" ? !m.completed : tab === "completed" ? m.completed : true,
  );

  return (
    <PhoneFrame>
      <PageHeader title="💊 My Medicines" back="/home" />
      <Screen withNav>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="mt-3 border-primary/30 bg-primary/5 shadow-card">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <span className="text-[28px]">🏆</span>
              <div>
                <p className="text-[16px] font-bold text-primary">Medicine Adherence: 95%</p>
                <p className="text-[13px] text-muted-foreground">Great job! You took 19 out of 20 scheduled doses this week.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-[14px]">
          <p className="font-semibold text-destructive">⚠️ Low Stock Alert:</p>
          <p className="text-[13px]">Paracetamol 500mg — only 2 days remaining. Reorder soon!</p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {shown.length === 0 ? (
            <EmptyState
              icon={<Pill className="size-6" />}
              title="No medicines here"
              message="Add a medicine or upload a prescription and we'll fill in the details."
              action={
                <Button asChild className="h-12">
                  <Link to="/medicines/add">Add medicine</Link>
                </Button>
              }
            />
          ) : null}

          {shown.map((m) => (
            <Card key={m.id} className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <Pill className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[18px] font-bold">{m.name}</p>
                    <p className="text-[16px]">{m.dosage}</p>
                    <p className="text-[14px] text-muted-foreground">{m.timing} · {m.purpose}</p>
                  </div>
                  <Switch
                    checked={m.active}
                    aria-label={`Toggle ${m.name}`}
                    onCheckedChange={(v: boolean) =>
                      setList((l) => l.map((x) => (x.id === m.id ? { ...x, active: v } : x)))
                    }
                  />
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-[14px]">
                    <span>Day {m.dayOf} of {m.totalDays}</span>
                    <span className="text-muted-foreground">{m.next}</span>
                  </div>
                  <Progress value={(m.dayOf / m.totalDays) * 100} className="mt-2 h-2" />
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="h-11 flex-1 text-[14px]" onClick={() => toast("Edit coming from your prescription")}>
                    <Pencil className="size-4" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 flex-1 text-[14px] text-destructive"
                    onClick={() => {
                      setList((l) => l.filter((x) => x.id !== m.id));
                      toast.success(`${m.name} removed`);
                    }}
                  >
                    <Trash2 className="size-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button variant="outline" className="mt-6 h-12 w-full text-[16px]" onClick={() => toast.success("Reminders set for all active medicines")}>
          <Bell className="size-4" /> Set reminders
        </Button>
      </Screen>

      <Link
        to="/medicines/add"
        aria-label="Add medicine"
        className="fixed bottom-24 left-1/2 z-30 ml-[110px] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float"
      >
        <Plus className="size-6" />
      </Link>

      <BottomNav />
    </PhoneFrame>
  );
}
