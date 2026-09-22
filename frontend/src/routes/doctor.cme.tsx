import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpen, ExternalLink, Video } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/doctor/cme")({
  head: () => ({
    meta: [
      { title: "Continuing Medical Education (CME) — MedSimplify Doctor" },
      { name: "description", content: "Latest medical research, accredited CME courses, ICMR treatment guidelines and credit tracking." },
      { property: "og:title", content: "Continuing Medical Education (CME) — MedSimplify Doctor" },
      { property: "og:description", content: "Medical research, case studies, ICMR guidelines and CME credits." },
    ],
  }),
  component: DoctorCmeScreen,
});

const cmeCourses = [
  { title: "2026 ICMR Dengue & Vector-Borne Fever Protocols", credits: "3 CME Credits", provider: "AIIMS New Delhi", type: "Webinar" },
  { title: "Advances in Pediatric Thrombocytopenia Management", credits: "2 CME Credits", provider: "Indian Academy of Pediatrics", type: "Case Study" },
  { title: "AI-Assisted Diagnostic Interpretation in Primary Care", credits: "4 CME Credits", provider: "IMA CME Academy", type: "Interactive" },
];

const researchPapers = [
  { title: "Platelet Kinetics & Early Warning Markers in Dengue Serotype 2", journal: "Lancet Infectious Diseases 2026", date: "Sep 2026" },
  { title: "Empagliflozin vs Dapagliflozin in Type 2 Diabetes with Renal Risk", journal: "NEJM Clinical Reports", date: "Aug 2026" },
];

function DoctorCmeScreen() {
  return (
    <PhoneFrame>
      <PageHeader title="📚 Doctor Learning (CME)" subtitle="Research papers & accredited courses" back="/doctor/dashboard" />
      <Screen>
        <Card className="border-primary/30 bg-primary/5 shadow-card">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Award className="size-8 text-primary shrink-0" />
              <div>
                <p className="text-[16px] font-bold text-primary">Your CME Credits: 18 / 30</p>
                <p className="text-[13px] text-muted-foreground">12 credits remaining for 2026 MCI License Renewal.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <SectionTitle>🎓 CME Courses & Webinars</SectionTitle>
        <div className="flex flex-col gap-3">
          {cmeCourses.map((c) => (
            <Card key={c.title} className="shadow-card">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <Badge className="bg-primary text-primary-foreground">{c.credits}</Badge>
                  <span className="text-[12px] font-semibold text-muted-foreground">{c.type}</span>
                </div>
                <p className="text-[16px] font-bold mt-2">{c.title}</p>
                <p className="text-[13px] text-muted-foreground mt-1">Provider: {c.provider}</p>
                <Button
                  variant="outline"
                  className="mt-3 h-10 w-full text-[13px]"
                  onClick={() => toast.success(`Enrolled in ${c.title}!`)}
                >
                  <Video className="size-4" /> Register & Join Webinar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <SectionTitle>🔬 Latest ICMR & Global Research Papers</SectionTitle>
        <div className="flex flex-col gap-2">
          {researchPapers.map((r) => (
            <Card key={r.title} className="shadow-card">
              <CardContent className="flex items-start gap-3 py-3">
                <BookOpen className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{r.title}</p>
                  <p className="text-[12px] text-muted-foreground">{r.journal} · {r.date}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => toast("Opening research abstract")}>
                  <ExternalLink className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Screen>
    </PhoneFrame>
  );
}
