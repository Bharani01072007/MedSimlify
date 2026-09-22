import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Search } from "lucide-react";
import React, { useState } from "react";
import { BottomNavDoctor, EmptyState, PageHeader, PhoneFrame, Screen } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { doctorPatients } from "@/lib/medsimplify-data";
import { cn } from "@/lib/utils";

const filters = ["All", "Today", "Follow-up", "Critical"] as const;

export const Route = createFileRoute("/doctor/patients")({
  head: () => ({
    meta: [
      { title: "My patients — MedSimplify" },
      {
        name: "description",
        content: "Search and filter your patient list and open a full patient record.",
      },
      { property: "og:title", content: "My patients — MedSimplify" },
      { property: "og:description", content: "Your full patient list with search and filters." },
    ],
  }),
  component: DoctorPatients,
});

function DoctorPatients() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");

  const list = doctorPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.condition.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PhoneFrame>
      <PageHeader title="My Patients" back="/doctor/dashboard" />
      <Screen>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            placeholder="Search by name or condition"
            aria-label="Search patients"
            className="h-12 pl-9 text-[16px]"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "tap-target whitespace-nowrap rounded-full border px-3 text-[14px]",
                filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {list.length === 0 ? (
            <EmptyState
              icon={<Search className="size-6" />}
              title="No patients found"
              message="Try a different name or condition."
            />
          ) : (
            list.map((p) => (
              <Card key={p.id} className="shadow-card">
                <CardContent className="p-0">
                  <Link to="/doctor/patient" className="tap-target flex items-center gap-3 px-4 py-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-[16px] font-bold text-primary">
                      {p.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-semibold">
                        {p.name} <span className="text-[14px] font-normal text-muted-foreground">{p.age}</span>
                      </p>
                      <p className="text-[14px] text-muted-foreground">
                        {p.condition} · last visit {p.lastVisit}
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground" />
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </Screen>
      <BottomNavDoctor />
    </PhoneFrame>
  );
}
