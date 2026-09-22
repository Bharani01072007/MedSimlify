import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BottomNavDoctor, PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/doctor/analytics")({
  head: () => ({
    meta: [
      { title: "Practice Analytics — MedSimplify Doctor" },
      {
        name: "description",
        content: "See your patient flow, top diagnoses, revenue trends and outcomes at a glance.",
      },
    ],
  }),
  component: DoctorAnalytics,
});

const patientFlowData = [
  { day: "Mon", patients: 14 },
  { day: "Tue", patients: 11 },
  { day: "Wed", patients: 18 },
  { day: "Thu", patients: 16 },
  { day: "Fri", patients: 20 },
  { day: "Sat", patients: 9 },
  { day: "Sun", patients: 3 },
];

const revenueData = [
  { month: "Apr", revenue: 182000 },
  { month: "May", revenue: 205000 },
  { month: "Jun", revenue: 194000 },
  { month: "Jul", revenue: 231000 },
  { month: "Aug", revenue: 248000 },
  { month: "Sep", revenue: 176000 },
];

const diagnosisData = [
  { name: "Viral fever", count: 84, fill: "#6366f1" },
  { name: "Dengue", count: 41, fill: "#f59e0b" },
  { name: "Hypertension", count: 37, fill: "#10b981" },
  { name: "Diabetes", count: 29, fill: "#3b82f6" },
  { name: "Gastritis", count: 18, fill: "#ef4444" },
];

const outcomeData = [
  { name: "Recovered", value: 68, fill: "#10b981" },
  { name: "Ongoing", value: 22, fill: "#6366f1" },
  { name: "Referred", value: 10, fill: "#f59e0b" },
];

const summaryCards = [
  { label: "Total patients this month", value: "312" },
  { label: "Avg. rating", value: "4.8 ★" },
  { label: "Telemedicine calls", value: "28" },
  { label: "Prescriptions written", value: "156" },
  { label: "Referrals sent", value: "12" },
  { label: "CME credits earned", value: "18 / 30" },
];

function DoctorAnalytics() {
  return (
    <PhoneFrame>
      <PageHeader title="Practice Analytics" back="/doctor/dashboard" />
      <Screen withNav>
        {/* Summary tiles */}
        <div className="grid grid-cols-3 gap-2">
          {summaryCards.map((c) => (
            <Card key={c.label} className="shadow-card">
              <CardContent className="px-2 py-4 text-center">
                <p className="text-[18px] font-bold text-primary">{c.value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{c.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Patient flow this week */}
        <SectionTitle>Patient Flow (This Week)</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="h-52 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientFlowData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={28} />
                <Tooltip />
                <Bar dataKey="patients" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue trend */}
        <SectionTitle>Revenue Trend (₹)</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="h-52 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={48} tickFormatter={(v: number) => `${v / 1000}k`} />
                <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top diagnoses */}
        <SectionTitle>Top Diagnoses</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="h-52 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diagnosisData} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={72} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {diagnosisData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient outcomes */}
        <SectionTitle>Patient Outcomes</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="flex items-center py-4 gap-4">
            <div style={{ width: 130, height: 130 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outcomeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={35}
                  >
                    {outcomeData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {outcomeData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="size-3 rounded-full shrink-0" style={{ background: d.fill }} />
                  <span className="text-[13px] flex-1">{d.name}</span>
                  <span className="text-[13px] font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Screen>
      <BottomNavDoctor />
    </PhoneFrame>
  );
}
