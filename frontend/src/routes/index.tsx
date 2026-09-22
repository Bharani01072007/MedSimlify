import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse, Loader2 } from "lucide-react";
import { useEffect } from "react";

import { PhoneFrame } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedSimplify — Your Health, Simplified" },
      {
        name: "description",
        content:
          "Understand your medical reports in plain language. Upload a lab report and get a simple summary, what to do next and warning signs to watch for.",
      },
      { property: "og:title", content: "MedSimplify — Your Health, Simplified" },
      {
        property: "og:description",
        content: "AI-powered medical report simplification for patients and families.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate({ to: "/login" }), 2000);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <PhoneFrame>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center animate-in fade-in duration-700">
        <div className="flex size-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-float">
          <HeartPulse className="size-12" />
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight text-primary">MedSimplify</h1>
        <p className="text-[16px] text-muted-foreground">Your Health, Simplified</p>
        <Loader2 className="mt-6 size-5 animate-spin text-muted-foreground" aria-hidden />
        <Link to="/login" className="caption-text mt-2 underline">
          Continue
        </Link>
      </main>
    </PhoneFrame>
  );
}
