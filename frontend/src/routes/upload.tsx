import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, Check, FileText, Images, Lightbulb, X } from "lucide-react";
import { useState } from "react";

import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setPendingUploadFile } from "@/lib/upload-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload a report — MedSimplify" },
      { name: "description", content: "Take a photo or upload a PDF of your lab report, scan or prescription to get a plain-language summary." },
      { property: "og:title", content: "Upload a report — MedSimplify" },
      { property: "og:description", content: "Photo, gallery or PDF — we simplify the rest." },
    ],
  }),
  component: UploadScreen,
});

const types = ["Lab Report", "X-ray/CT/MRI", "Prescription", "Discharge Summary", "Other"];

const sources = [
  { label: "Take Photo", hint: "Use your camera", icon: Camera },
  { label: "Choose from Gallery", hint: "Pick an existing image", icon: Images },
  { label: "Upload PDF", hint: "Select a PDF file", icon: FileText },
];

function UploadScreen() {
  const navigate = useNavigate();
  const [type, setType] = useState<string>(types[0] ?? "");
  const [source, setSource] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPendingUploadFile(file);
      sessionStorage.setItem("pending_upload_filename", file.name);
      sessionStorage.removeItem("latest_analysis_result");
    }
  };

  const handleNext = () => {
    sessionStorage.setItem("pending_upload_type", type);
    sessionStorage.removeItem("latest_analysis_result");
    navigate({ to: "/analyzing" });
  };

  return (
    <PhoneFrame>
      <PageHeader title="Upload Medical Report" back="/home" />
      <Screen>
        <SectionTitle>Report type</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={cn(
                "tap-target rounded-lg border px-3 text-[14px] font-medium transition-colors",
                type === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <SectionTitle>How would you like to add it?</SectionTitle>
        <div className="flex flex-col gap-3">
          {sources.map(({ label, hint, icon: Icon }) => (
            <div key={label} className="relative">
              <button
                type="button"
                onClick={() => {
                  setSource(label);
                  const el = document.getElementById("hidden-file-input") as HTMLInputElement;
                  if (el) el.click();
                }}
                aria-pressed={source === label}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border-2 bg-card p-4 text-left shadow-card transition-colors",
                  source === label ? "border-primary" : "border-transparent",
                )}
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="size-6" />
                </span>
                <span className="flex-1">
                  <span className="block text-[16px] font-semibold">{label}</span>
                  <span className="caption-text">{selectedFile && source === label ? selectedFile.name : hint}</span>
                </span>
                {source === label ? <Check className="size-5 text-primary" /> : null}
              </button>
            </div>
          ))}
          <input
            id="hidden-file-input"
            type="file"
            accept="image/*,application/pdf,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <SectionTitle>For the best result</SectionTitle>
        <Card className="border-accent bg-accent/60 shadow-none">
          <CardContent className="flex gap-3 pt-6">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
            <ul className="flex flex-col gap-1 text-[14px]">
              <li>Ensure good lighting</li>
              <li>Keep the report flat and clear</li>
              <li>All 4 corners visible</li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border-2 border-success bg-card p-3 text-center">
            <div className="mx-auto mb-2 h-20 rounded-md bg-muted" aria-hidden />
            <p className="flex items-center justify-center gap-1 text-[14px] font-semibold text-success">
              <Check className="size-4" /> Good photo
            </p>
            <p className="caption-text">Flat, bright, full page</p>
          </div>
          <div className="rounded-xl border-2 border-destructive bg-card p-3 text-center">
            <div className="mx-auto mb-2 h-20 rotate-2 rounded-md bg-muted opacity-60" aria-hidden />
            <p className="flex items-center justify-center gap-1 text-[14px] font-semibold text-destructive">
              <X className="size-4" /> Bad photo
            </p>
            <p className="caption-text">Blurred, tilted, cropped</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="h-12 flex-1 text-[16px]" onClick={() => navigate({ to: "/home" })}>
            Cancel
          </Button>
          <Button
            className="h-12 flex-1 text-[16px]"
            disabled={!source}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
        {!source ? <p className="caption-text mt-2 text-center">Choose a photo, gallery image or PDF to continue.</p> : null}
      </Screen>
    </PhoneFrame>
  );
}
