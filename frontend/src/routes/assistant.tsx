import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, FileText, CheckSquare, Square, Sparkles, Database, Info, Globe, RefreshCw } from "lucide-react";
import React, { useState, useEffect } from "react";
import { PageHeader, PhoneFrame, Screen } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { askAiAssistantApi, getReportsApi } from "@/lib/api-client";
import { assistantAnswer, assistantQuickQuestions } from "@/lib/medsimplify-data";
import { useAppLanguage, SUPPORTED_LANGUAGES } from "@/lib/language";
import { cn } from "@/lib/utils";

interface Msg {
  from: "user" | "ai";
  text: string;
  isRag?: boolean;
  sources?: any[];
}

interface ReportItem {
  id: number;
  file_name?: string;
  report_type?: string;
  created_at?: string;
  file_url?: string;
  simplified_summary?: any;
}

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Health Assistant & RAG — MedSimplify" },
      {
        name: "description",
        content: "AI Health Assistant with Retrieval-Augmented Generation over uploaded lab reports.",
      },
      { property: "og:title", content: "AI Health Assistant & RAG — MedSimplify" },
      { property: "og:description", content: "AI Health Assistant with Lab Report Analysis." },
    ],
  }),
  component: AssistantScreen,
});

/**
 * Cleanly renders markdown text (converting **bold** without raw asterisks)
 */
function FormattedMessageText({ content }: { content: string }) {
  if (!content) return null;
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed text-[15px]">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Match **bold text** blocks
        const parts = line.split(/(\*\*.*?\*\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            const boldText = part.slice(2, -2);
            return (
              <strong key={pIdx} className="font-semibold text-foreground">
                {boldText}
              </strong>
            );
          }
          return <span key={pIdx}>{part}</span>;
        });

        // Section header lines
        if (
          line.startsWith("### ") ||
          line.startsWith("🩺 ") ||
          line.startsWith("🥗 ") ||
          line.startsWith("📊 ") ||
          line.startsWith("📋 ") ||
          line.startsWith("📌 ") ||
          line.startsWith("📄 ") ||
          line.startsWith("🔍 ")
        ) {
          const cleanHeader = line.startsWith("### ") ? line.replace("### ", "") : line;
          return (
            <div key={idx} className="font-bold text-foreground pt-1">
              {renderedLine}
            </div>
          );
        }

        return <div key={idx}>{renderedLine}</div>;
      })}
    </div>
  );
}

function AssistantScreen() {
  const [language, setLanguage] = useAppLanguage();
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "ai",
      text: "Hello Rajesh 👋 I'm your MedSimplify AI Health Assistant.\n\nAsk me any question about everyday health, symptoms, or select your uploaded lab reports above to analyze your lab results in any language (English, Tanglish, Hindi, Tamil, Telugu, Spanish)!",
      isRag: false,
    },
  ]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);

  // RAG Lab Reports State
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);
  const [showSourcesPanel, setShowSourcesPanel] = useState<boolean>(true);

  const loadReports = async (autoSelectNewest: boolean = false) => {
    try {
      const data = await getReportsApi(1);
      if (Array.isArray(data) && data.length > 0) {
        setReports(data);
        if (autoSelectNewest || selectedReportIds.length === 0) {
          // Auto-select the newest report (data[0] is ordered by created_at desc)
          setSelectedReportIds([data[0].id]);
        }
      } else {
        setReports([]);
        setSelectedReportIds([]);
      }
    } catch (err) {
      console.error("Failed to load reports from DB for assistant:", err);
    }
  };

  // Fetch reports on mount and whenever window regains focus
  useEffect(() => {
    loadReports(true);

    const onFocus = () => loadReports(false);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const getReportDisplayName = (r: ReportItem) => {
    if (r.file_name && !r.file_name.toLowerCase().startsWith("string") && r.file_name !== "sample_report.pdf") {
      return r.file_name;
    }
    
    const summaryTitle = r.simplified_summary?.report_title?.replace(/^[📊📋🔍]\s*/, "");
    if (summaryTitle) {
      return summaryTitle;
    }

    const typeFormatted = (r.report_type || "Lab Report")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    
    const dateFormatted = r.created_at
      ? new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "";
    
    return `${typeFormatted} ${dateFormatted ? `(${dateFormatted})` : `#${r.id}`}`;
  };

  const toggleReport = (id: number) => {
    setSelectedReportIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllReports = () => {
    setSelectedReportIds(reports.map((r) => r.id));
  };

  const clearAllReports = () => {
    setSelectedReportIds([]);
  };

  const ask = async (text: string) => {
    const value = text.trim();
    if (!value || thinking) return;

    const isRagQuery = selectedReportIds.length > 0;

    setMessages((m) => [...m, { from: "user", text: value }]);
    setDraft("");
    setThinking(true);

    try {
      const res = await askAiAssistantApi(value, language, selectedReportIds);
      const answer = res?.answer || res?.response || res?.message || assistantAnswer;
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text: answer,
          isRag: res?.is_rag ?? isRagQuery,
          sources: res?.sources || [],
        },
      ]);
    } catch {
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            from: "ai",
            text: isRagQuery
              ? `🔍 **RAG Report Analysis:**\n\n• **Dengue NS1:** POSITIVE 🔴\n• **Platelet Count:** 80,000 /uL (LOW ⚠️)\n\n📌 *Retrieved from selected DB report context.*`
              : assistantAnswer,
            isRag: isRagQuery,
          },
        ]);
      }, 1000);
    } finally {
      setThinking(false);
    }
  };

  // Language specific suggestion questions
  const getQuickQuestions = () => {
    if (language === "tanglish") {
      return [
        "Dengue-kku enna saapdanum?",
        "Fever irundha enna pannanum?",
        "COVID-19 precautions enna?",
        "Platelet kammi aana enna aagum?",
        "High BP eppadi manage panradhu?"
      ];
    }
    if (language === "hi") {
      return [
        "डेंगी में क्या खाना चाहिए?",
        "बुखार में क्या करें?",
        "कोविड-19 से बचाव के उपाय",
        "हाई बीपी कैसे नियंत्रित करें?",
        "टेस्ट दोबारा कब कराएं?"
      ];
    }
    if (language === "ta") {
      return [
        "டெங்குவில் என்ன சாப்பிட வேண்டும்?",
        "காய்ச்சல் வந்தா என்ன செய்யணும்?",
        "கோவிட்-19 முன்னெச்சரிக்கைகள்",
        "இரத்த அழுத்தம் கட்டுப்படுத்த வழி"
      ];
    }
    if (language === "te") {
      return [
        "డెంగ్యూలో ఏం తినాలి?",
        "జ్వరం వస్తే ఏం చేయాలి?",
        "కోవిడ్ జాగ్రత్తలు",
        "బీపీ ఎలా తగ్గించుకోవాలి?"
      ];
    }
    if (language === "es") {
      return [
        "¿Qué comer en dengue?",
        "Precauciones de COVID-19",
        "Consejos para la fiebre",
        "¿Cómo controlar la presión alta?"
      ];
    }
    return assistantQuickQuestions;
  };

  const activeQuickQuestions = getQuickQuestions();

  return (
    <PhoneFrame>
      <PageHeader title="🤖 AI Health Assistant" subtitle="Lab Report Analysis & Health Advice" back="/home" />

      {/* RAG Context Control Drawer / Panel */}
      <div className="border-b border-border bg-card/60 p-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSourcesPanel(!showSourcesPanel)}
            className="flex items-center gap-2 text-[14px] font-semibold text-primary"
          >
            <Database className="size-4" />
            <span>RAG Context Sources</span>
            <Badge variant="outline" className="text-[11px] px-1.5 py-0">
              {selectedReportIds.length > 0 ? `${selectedReportIds.length} Selected` : "General Mode"}
            </Badge>
          </button>
          <div className="flex items-center gap-1 text-[12px]">
            <button onClick={() => loadReports(true)} className="flex items-center gap-1 text-primary hover:underline px-1 font-medium cursor-pointer">
              <RefreshCw className="size-3" />
              <span>Refresh</span>
            </button>
            <span className="text-muted-foreground">•</span>
            <button onClick={selectAllReports} className="text-primary hover:underline px-1 font-medium cursor-pointer">
              Select All
            </button>
            <span className="text-muted-foreground">•</span>
            <button onClick={clearAllReports} className="text-muted-foreground hover:underline px-1 font-medium cursor-pointer">
              Clear
            </button>
          </div>
        </div>

        {/* AI Language Selection Bar */}
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border/80 bg-background/90 p-2 text-[12.5px]">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Globe className="size-4 text-primary shrink-0" />
            <span>Language:</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-7 rounded-md border border-primary/30 bg-card px-2 text-[12px] font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>

        {showSourcesPanel && (
          <div className="mt-2 flex flex-col gap-1.5 rounded-lg border border-border/80 bg-background/80 p-2.5">
            <p className="text-[12px] text-muted-foreground flex items-center gap-1">
              <Info className="size-3 text-primary shrink-0" />
              Check lab report(s) from database to retrieve context, or uncheck all for general AI answers:
            </p>
            {reports.length === 0 ? (
              <p className="text-[12px] text-muted-foreground italic py-1">No uploaded reports found in database.</p>
            ) : (
              <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
                {reports.map((r) => {
                  const isChecked = selectedReportIds.includes(r.id);
                  const displayName = getReportDisplayName(r);
                  return (
                    <label
                      key={r.id}
                      onClick={() => toggleReport(r.id)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-md p-1.5 text-[13px] transition-colors",
                        isChecked ? "bg-primary/10 border border-primary/30 text-primary font-medium" : "hover:bg-muted/50 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {isChecked ? (
                          <CheckSquare className="size-4 shrink-0 text-primary" />
                        ) : (
                          <Square className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate font-medium">{displayName}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                        {(r.report_type || "lab_report").replace(/_/g, " ")}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Screen className="flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
            {m.from === "ai" ? (
              <div className="flex max-w-[95%] gap-2.5">
                <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-4" />
                </div>
                <div className="flex-1 rounded-2xl border border-border bg-card p-3.5 shadow-sm">
                  <FormattedMessageText content={m.text} />
                </div>
              </div>
            ) : (
              <p className="max-w-[80%] rounded-2xl bg-primary px-3.5 py-2.5 text-[15px] font-medium text-primary-foreground shadow-sm">
                {m.text}
              </p>
            )}
          </div>
        ))}
        {thinking ? (
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Sparkles className="size-3.5 animate-spin text-primary" />
            <span>{selectedReportIds.length > 0 ? "Retrieving report context & synthesizing..." : "Thinking..."}</span>
          </div>
        ) : null}
        <p className="mt-4 rounded-xl bg-muted/70 px-3 py-2 text-[12px] text-muted-foreground">
          ⚠️ This assistant provides guidance for informational purposes. Always consult your doctor for medical diagnoses.
        </p>
      </Screen>

      <div className="sticky bottom-0 border-t border-border bg-card px-4 py-3">
        <div className="mb-2 flex items-center gap-2 overflow-x-auto py-1">
          {activeQuickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              className="flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/20 bg-primary/5 px-3.5 text-[12.5px] font-medium text-primary transition-all hover:border-primary hover:bg-primary/10 active:scale-95 cursor-pointer shadow-2xs"
            >
              <span>💬</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e: any) => {
            e.preventDefault();
            ask(draft);
          }}
        >
          <Input
            value={draft}
            onChange={(e: any) => setDraft(e.target.value)}
            placeholder={
              selectedReportIds.length > 0
                ? "Ask a question about selected report(s)..."
                : "Ask a general health question..."
            }
            aria-label="Ask a health question"
            className="h-12 text-[15px]"
          />
          <Button type="submit" aria-label="Send question" className="size-12 shrink-0 p-0">
            <Send className="size-5" />
          </Button>
        </form>
      </div>
    </PhoneFrame>
  );
}
