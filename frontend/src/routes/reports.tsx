import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, FileText, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { BottomNav, EmptyState, PageHeader, PhoneFrame, Screen } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getReportsApi } from "@/lib/api-client";
import { reports as seed, type ReportItem, type ReportType } from "@/lib/medsimplify-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "My health records — MedSimplify" },
      { name: "description", content: "Every lab report, scan and prescription in one timeline, with abnormal results highlighted." },
      { property: "og:title", content: "My health records — MedSimplify" },
      { property: "og:description", content: "Your reports in one searchable timeline." },
    ],
  }),
  component: ReportsScreen,
});

export interface ReportItem {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  month: string;
  time: string;
  keyFinding: string;
  abnormal?: string;
  rawData?: any;
}

const filters: Array<"All" | ReportType> = ["All", "Lab", "X-ray", "Rx", "Discharge"];

function ReportsScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [reports, setReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const live = await getReportsApi(1);
        if (Array.isArray(live) && live.length > 0) {
          // Map backend fields to frontend shape accurately
          const mapped: ReportItem[] = live.map((r: any, i: number) => {
            const rawType = (r.report_type || "").toLowerCase();
            let rType: ReportType = "Lab";
            if (rawType.includes("x_ray") || rawType.includes("xray")) rType = "X-ray";
            else if (rawType.includes("rx") || rawType.includes("prescription")) rType = "Rx";
            else if (rawType.includes("discharge")) rType = "Discharge";

            const title =
              r.simplified_summary?.title ||
              r.extracted_data?.test_name ||
              r.file_name ||
              "Medical Report";

            const keyFinding =
              r.simplified_summary?.flagged_reason ||
              r.simplified_summary?.standard_summary ||
              r.raw_text?.slice(0, 120) ||
              "Report Summary";

            const isFlagged = r.simplified_summary?.is_flagged || r.is_flagged;
            const abnormalText = isFlagged
              ? (r.flagged_reason || r.simplified_summary?.flagged_reason || "Critical / High Risk Finding Flagged")
              : undefined;

            const dateObj = r.created_at ? new Date(r.created_at) : new Date();
            const dateStr = dateObj.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
            const monthStr = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

            return {
              id: String(r.id || i + 1),
              title,
              type: rType,
              date: dateStr,
              month: monthStr,
              time: timeStr,
              keyFinding,
              abnormal: abnormalText,
              rawData: r,
            };
          });
          setReports(mapped);
        } else {
          setReports(seed);
        }
      } catch (err) {
        console.warn("Reports API fallback to seed:", err);
        setReports(seed);
      }
    }
    loadReports();
  }, []);

  const grouped = useMemo(() => {
    const list = reports.filter(
      (r) =>
        (filter === "All" || r.type === filter) &&
        (r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.keyFinding.toLowerCase().includes(query.toLowerCase())),
    );
    const map = new Map<string, typeof list>();
    for (const r of list) map.set(r.month, [...(map.get(r.month) ?? []), r]);
    return [...map.entries()];
  }, [reports, query, filter]);

  const handleReportClick = (report: ReportItem) => {
    if (report.rawData) {
      try {
        sessionStorage.setItem("latest_analysis_result", JSON.stringify(report.rawData));
      } catch (e) {
        console.warn("Failed to store selected report:", e);
      }
    }
  };

  return (
    <PhoneFrame>
      <PageHeader title="📁 My Health Records" back="/home" />
      <Screen withNav>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            placeholder="Search reports..."
            aria-label="Search reports"
            className="h-11 pl-9"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "tap-target rounded-full border px-4 text-[14px] font-medium",
                filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {grouped.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<FileText className="size-6" />}
              title="No reports found"
              message="Try a different search, or upload a new report to get a simple summary."
              action={
                <Button asChild className="h-12">
                  <Link to="/upload">Upload a report</Link>
                </Button>
              }
            />
          </div>
        ) : null}

        {grouped.map(([month, items]) => (
          <section key={month} className="mt-6">
            <h3 className="mb-3 text-[18px] font-bold">{month}</h3>
            <ol className="relative flex flex-col gap-3 border-l-2 border-border pl-4">
              {items.map((r) => (
                <li key={r.id} className="relative">
                  <span className="absolute -left-[22px] top-5 size-3 rounded-full border-2 border-background bg-primary" />
                  <Link
                    to="/results"
                    onClick={() => handleReportClick(r)}
                    className="block rounded-xl bg-card p-4 shadow-card"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <FileText className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-semibold">{r.title}</p>
                        <p className="caption-text">
                          {r.date}, {r.time}
                        </p>
                        <p className="mt-1 text-[14px]">{r.keyFinding}</p>
                        {r.abnormal ? (
                          <p className="mt-1 text-[14px] font-semibold text-destructive">{r.abnormal}</p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <Button asChild variant="outline" className="mt-6 h-12 w-full text-[16px]">
          <Link to="/compare">
            <BarChart3 className="size-4" /> Compare reports
          </Link>
        </Button>
      </Screen>

      <Link
        to="/upload"
        aria-label="Upload new report"
        className="fixed bottom-24 left-1/2 z-30 ml-[110px] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float"
      >
        <Plus className="size-6" />
      </Link>

      <BottomNav />
    </PhoneFrame>
  );
}
