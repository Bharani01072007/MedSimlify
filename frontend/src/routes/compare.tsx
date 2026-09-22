import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Download, Lightbulb } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { comparisonRows, plateletTrend, reports as seedReports } from "@/lib/medsimplify-data";
import { getReportsApi, getReportTrendsApi } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare reports — MedSimplify" },
      { name: "description", content: "See how your test values changed between reports, with trend charts and plain-language insight." },
      { property: "og:title", content: "Compare reports — MedSimplify" },
      { property: "og:description", content: "Trends and changes between your reports, explained simply." },
    ],
  }),
  component: CompareScreen,
});

function CompareScreen() {
  const [selected, setSelected] = useState<string[]>(["r1", "r2"]);
  const [compared, setCompared] = useState(true);
  const [reportList, setReportList] = useState(seedReports);
  const [trendData, setTrendData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadReports() {
      try {
        const live = await getReportsApi(1);
        if (Array.isArray(live) && live.length > 0) {
          const mapped = live.map((r: any, i: number) => ({
            id: String(r.id || i + 1),
            title: r.simplified_summary?.title || r.file_name || r.report_type || "Medical Report",
            type: "Lab" as const,
            date: r.created_at?.split("T")[0] || "Recent",
            month: new Date(r.created_at || Date.now()).toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
            time: "–",
            keyFinding: r.simplified_summary?.flagged_reason || "Report Summary",
          }));
          setReportList(mapped);
          if (mapped.length >= 2) {
            setSelected([mapped[0].id, mapped[1].id]);
          }
        }
      } catch (err) {
        console.warn("Compare reports fallback:", err);
      }
    }
    loadReports();
  }, []);

  async function handleCompare() {
    setLoading(true);
    setCompared(true);
    try {
      const res = await getReportTrendsApi(selected.join(","));
      if (res) {
        setTrendData(res);
      }
    } catch (err) {
      console.warn("API trend compare warning:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneFrame>
      <PageHeader title="📊 Compare Reports" back="/reports" />
      <Screen>
        <p className="text-[16px] font-medium">Select 2-3 reports to compare:</p>
        <div className="mt-3 flex flex-col gap-2">
          {reportList.map((r) => (
            <label
              key={r.id}
              className="tap-target flex items-center gap-3 rounded-xl bg-card p-3 shadow-card"
            >
              <Checkbox
                checked={selected.includes(r.id)}
                onCheckedChange={() => {
                  setCompared(false);
                  setSelected((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : s.length < 3 ? [...s, r.id] : s));
                }}
              />
              <span className="flex-1">
                <span className="block text-[16px] font-medium">{r.title}</span>
                <span className="caption-text">{r.date}</span>
              </span>
            </label>
          ))}
        </div>

        <Button
          className="mt-4 h-12 w-full text-[16px]"
          disabled={selected.length < 2 || loading}
          onClick={handleCompare}
        >
          {loading ? "Analyzing trends..." : "Compare Now"}
        </Button>

        {compared && selected.length >= 2 ? (
          <>
            <SectionTitle>Platelet count trend</SectionTitle>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={plateletTrend} margin={{ left: -10, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${v / 1000}k`} />
                      <Tooltip formatter={(v: number) => v.toLocaleString()} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-destructive)"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-[14px] font-semibold text-destructive">
                  ↓ Declining — 210,000 to 80,000 in 3 days
                </p>
              </CardContent>
            </Card>

            <SectionTitle>Value by value</SectionTitle>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>Earlier</TableHead>
                      <TableHead>Latest</TableHead>
                      <TableHead>Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trendData?.comparison_table ? (
                      trendData.comparison_table.map((r: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="text-[14px] font-medium">{r.test}</TableCell>
                          <TableCell className="text-[14px]">{r.val_13_sep || r.earlier || "-"}</TableCell>
                          <TableCell className="text-[14px]">{r.val_15_sep || r.latest || "-"}</TableCell>
                          <TableCell
                            className={cn(
                              "text-[14px] font-semibold",
                              r.status === "warning" || r.change?.includes("↓") ? "text-destructive" : "text-success",
                            )}
                          >
                            {r.change}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      comparisonRows.map((r) => (
                        <TableRow key={r.test}>
                          <TableCell className="text-[14px] font-medium">{r.test}</TableCell>
                          <TableCell className="text-[14px]">{r.a}</TableCell>
                          <TableCell className="text-[14px]">{r.b}</TableCell>
                          <TableCell
                            className={cn(
                              "text-[14px] font-semibold",
                              r.change < 0 ? "text-destructive" : "text-success",
                            )}
                          >
                            <span className="flex items-center gap-1">
                              {r.change < 0 ? (
                                <ArrowDownRight className="size-4" />
                              ) : (
                                <ArrowUpRight className="size-4" />
                              )}
                              {Math.abs(r.change)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="mt-4 border-warning/50 bg-warning/10 shadow-none">
              <CardContent className="flex gap-3 pt-6">
                <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-[16px] font-bold">💡 AI insight</p>
                  <p className="mt-1 text-[16px]">
                    {trendData?.ai_insight ||
                      "Your platelets have fallen 33% in one day. This is common around day 4-5 of dengue, but it needs close watching. Repeat the test tomorrow morning and go to hospital immediately if you notice any bleeding."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="mt-4 h-12 w-full text-[16px]"
              onClick={() => toast.success("Comparison downloaded")}
            >
              <Download className="size-4" /> Download comparison
            </Button>
          </>
        ) : null}
      </Screen>
    </PhoneFrame>
  );
}
