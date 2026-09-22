import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { PhoneFrame, Screen } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { analysisSteps } from "@/lib/medsimplify-data";
import { uploadReportApi } from "@/lib/api-client";

import { getPendingUploadFile } from "@/lib/upload-store";

export const Route = createFileRoute("/analyzing")({
  head: () => ({
    meta: [
      { title: "Analyzing your report — MedSimplify" },
      { name: "description", content: "Your report is being read and simplified into plain language." },
      { property: "og:title", content: "Analyzing your report — MedSimplify" },
      { property: "og:description", content: "Reading, analyzing and simplifying your medical report." },
    ],
  }),
  component: AnalyzingScreen,
});

function AnalyzingScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(5);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Smoothly increment progress up to 90%
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        if (prev < 90) return prev + 3;
        return 90;
      });
    }, 100);

    const finishAnalysis = () => {
      if (mounted) {
        clearInterval(progressTimer);
        setProgress(100);
        setIsFinished(true);
      }
    };

    // Max 3-second safety timer to ensure screen NEVER hangs at 90%
    const safetyTimer = setTimeout(() => {
      finishAnalysis();
    }, 3000);

    const runAnalysis = async () => {
      try {
        const formData = new FormData();
        const pendingType = sessionStorage.getItem("pending_upload_type") || "lab_report";
        formData.append("patient_id", "1");
        formData.append("report_type", pendingType);

        const pendingFile = getPendingUploadFile();
        if (pendingFile) {
          formData.append("file", pendingFile, pendingFile.name);
        }

        // Await live backend report upload endpoint
        const res = await uploadReportApi(formData);
        if (mounted && res) {
          try {
            sessionStorage.setItem("latest_analysis_result", JSON.stringify(res));
          } catch (storageErr) {
            console.warn("Failed to write to sessionStorage:", storageErr);
          }
        }
      } catch (err) {
        console.warn("Backend report analysis warning:", err);
      } finally {
        finishAnalysis();
      }
    };

    runAnalysis();

    return () => {
      mounted = false;
      clearInterval(progressTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    if (!isFinished) return;

    const navTimer = setTimeout(() => {
      navigate({ to: "/results" });
    }, 200);

    return () => clearTimeout(navTimer);
  }, [isFinished, navigate]);

  const stepsList = Array.isArray(analysisSteps) && analysisSteps.length > 0
    ? analysisSteps
    : ["Reading report...", "Analyzing parameters...", "Simplifying terms...", "Generating summary..."];
  const stepIndex = Math.max(0, Math.min(stepsList.length - 1, Math.floor((progress || 0) / 26)));
  const currentStepText = stepsList[stepIndex] || "Analyzing medical content...";

  return (
    <PhoneFrame>
      <Screen className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="relative flex size-32 items-center justify-center rounded-full bg-accent">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" aria-hidden />
          <Sparkles className="size-12 text-primary" />
        </div>

        <div className="w-full">
          <Progress value={progress} className="h-3" />
          <p className="mt-2 text-[20px] font-bold text-primary">{progress}%</p>
        </div>

        <p aria-live="polite" className="text-[16px] font-medium">
          {currentStepText}
        </p>
        <p className="caption-text">AI is reading and simplifying your health parameters</p>

        <Button variant="ghost" className="h-12 text-[14px]" onClick={() => navigate({ to: "/home" })}>
          Cancel
        </Button>
      </Screen>
    </PhoneFrame>
  );
}
