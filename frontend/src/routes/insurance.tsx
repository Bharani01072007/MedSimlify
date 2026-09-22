import { createFileRoute } from "@tanstack/react-router";
import { Download, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { patient } from "@/lib/medsimplify-data";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Health Insurance Claims & Records — MedSimplify" },
      { name: "description", content: "Generate health summary statements for insurance claims, pre-authorization helper and claim status tracking." },
      { property: "og:title", content: "Health Insurance Support — MedSimplify" },
      { property: "og:description", content: "Download medical claim statements and track reimbursement status." },
    ],
  }),
  component: InsuranceScreen,
});

const activeClaims = [
  { claimId: "CLM-99201", policy: "Star Health Comprehensive", amount: "₹45,000", status: "In Pre-Authorization", date: "14-Sep-2026" },
  { claimId: "CLM-88104", policy: "HDFC ERGO Health Suraksha", amount: "₹12,400", status: "Approved (Reimbursed)", date: "28-Aug-2026" },
];

function InsuranceScreen() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadStatement = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast.success("Medical Claim Statement downloaded as PDF!");
    }, 1200);
  };

  return (
    <PhoneFrame>
      <PageHeader title="📋 Insurance Claim Support" subtitle="Download records for cash-less & claims" back="/reports" />
      <Screen withNav>
        <Card className="border-primary/30 bg-primary/5 shadow-card">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-8 text-primary shrink-0" />
              <div>
                <p className="text-[16px] font-bold text-primary">Active Policy: Star Health Care</p>
                <p className="text-[13px] text-muted-foreground">Policy No: SH-88219400 · Cover: ₹5,00,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <SectionTitle>📄 Generate Claim Statement</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="py-4">
            <p className="text-[15px] font-semibold">Consolidated Medical Summary PDF</p>
            <p className="text-[13px] text-muted-foreground mt-1">Includes lab diagnostic reports, hospital discharge summaries, doctor prescriptions, and itemized bill history for {patient.name}.</p>
            <Button
              className="mt-4 h-11 w-full text-[14px]"
              disabled={downloading}
              onClick={handleDownloadStatement}
            >
              <Download className="size-4" /> {downloading ? "Generating PDF..." : "Download Claim PDF Package"}
            </Button>
          </CardContent>
        </Card>

        <SectionTitle>📊 Recent Claim Status</SectionTitle>
        <div className="flex flex-col gap-3">
          {activeClaims.map((c) => (
            <Card key={c.claimId} className="shadow-card">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline">{c.claimId}</Badge>
                    <p className="text-[16px] font-bold mt-1">{c.policy}</p>
                    <p className="text-[13px] text-muted-foreground">{c.date} · Claim Amount: {c.amount}</p>
                  </div>
                  <Badge variant="secondary" className="text-primary">{c.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Screen>
    </PhoneFrame>
  );
}
