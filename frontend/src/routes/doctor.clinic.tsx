import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { commonDiagnoses, revenueByMonth } from "@/lib/medsimplify-data";

export const Route = createFileRoute("/doctor/clinic")({
  head: () => ({
    meta: [
      { title: "Clinic dashboard — MedSimplify" },
      {
        name: "description",
        content: "Clinic revenue trend, patient demographics, common diagnoses, staff and stock at a glance.",
      },
      { property: "og:title", content: "Clinic dashboard — MedSimplify" },
      { property: "og:description", content: "Revenue, diagnoses, staff and inventory for your clinic." },
    ],
  }),
  component: ClinicDashboard,
});

const staff = [
  { name: "Nurse Anita", role: "Nursing", status: "On duty" },
  { name: "Ravi (Front desk)", role: "Reception", status: "On duty" },
  { name: "Dr. Anil Mehta", role: "Visiting physician", status: "Off today" },
];

const stock = [
  { item: "Paracetamol 500mg", left: "420 strips", low: false },
  { item: "ORS sachets", left: "38 packs", low: true },
  { item: "Dengue NS1 kits", left: "12 kits", low: true },
];

function ClinicDashboard() {
  return (
    <PhoneFrame>
      <PageHeader title="Clinic Overview" back="/doctor/dashboard" />
      <Screen>
        <div className="grid grid-cols-3 gap-2">
          <Stat value="₹2.4L" label="This month" />
          <Stat value="312" label="Patients" />
          <Stat value="4.8★" label="Rating" />
        </div>
        <SectionTitle>Revenue trend</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="h-56 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={48} tickFormatter={(v: number) => `${v / 1000}k`} />
                <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`} />
                <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <SectionTitle>Most common diagnoses</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="h-56 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commonDiagnoses}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 12 }} width={30} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <SectionTitle>Staff today</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="divide-y divide-border p-0">
            {staff.map((s) => (
              <div key={s.name} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold">{s.name}</p>
                  <p className="text-[14px] text-muted-foreground">{s.role}</p>
                </div>
                <span className="text-[14px] text-muted-foreground">{s.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <SectionTitle>Stock</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="divide-y divide-border p-0">
            {stock.map((s) => (
              <div key={s.item} className="flex items-center gap-3 px-4 py-3">
                <p className="flex-1 text-[16px]">{s.item}</p>
                <span className={s.low ? "text-[14px] font-semibold text-destructive" : "text-[14px]"}>
                  {s.left}
                  {s.low ? " · reorder" : ""}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </Screen>
    </PhoneFrame>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Card className="shadow-card">
      <CardContent className="px-2 py-4 text-center">
        <p className="text-[20px] font-bold text-primary">{value}</p>
        <p className="text-[12px] text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
