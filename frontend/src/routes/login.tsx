import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, HeartPulse, Loader2, Lock, Mail, Phone, Stethoscope, User } from "lucide-react";
import React, { useState } from "react";
import { PhoneFrame, Screen } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginApi } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — MedSimplify" },
      { name: "description", content: "Sign in to MedSimplify to view your simplified medical reports, medicines and appointments." },
      { property: "og:title", content: "Sign in — MedSimplify" },
      { property: "og:description", content: "Access your simplified health records." },
    ],
  }),
  component: LoginScreen,
});

function LoginScreen() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("rajesh@email.com");
  const [password, setPassword] = useState("••••••••");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    if (role === "doctor") {
      navigate({ to: "/doctor/dashboard" });
      return;
    }
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 4) return setError("Password must be at least 4 characters.");
    setError("");
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      if (res?.access_token) {
        localStorage.setItem("medsimplify_token", res.access_token);
      }
      navigate({ to: "/home" });
    } catch (err: any) {
      console.warn("Auth API warning:", err?.message || err);
      navigate({ to: "/home" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneFrame>
      <Screen className="flex flex-col justify-center gap-5 py-6">
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <HeartPulse className="size-8" />
          </div>
          <h1 className="mt-3 text-[24px] font-bold">Welcome to MedSimplify</h1>
          <p className="mt-0.5 text-[14px] text-muted-foreground">Select your portal role to log in</p>
        </div>

        {/* Lovable Portal Role Selector */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              setRole("patient");
              setEmail("rajesh@email.com");
            }}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border p-3.5 text-center transition-all cursor-pointer",
              role === "patient"
                ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-muted/50"
            )}
          >
            <User className="size-6" />
            <span className="text-[14px]">Patient Portal</span>
            <span className="text-[11px] font-normal opacity-80">AI Reports & Reminders</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("doctor");
              setEmail("dr.priya@medsimplify.com");
            }}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border p-3.5 text-center transition-all cursor-pointer",
              role === "doctor"
                ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Stethoscope className="size-6" />
            <span className="text-[14px]">Doctor Portal</span>
            <span className="text-[11px] font-normal opacity-80">EMR, Chat & Telemed</span>
          </button>
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">{role === "doctor" ? "Doctor MCI Reg ID / Email" : "Email Address"}</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    className="h-12 pl-9 text-[15px]"
                    placeholder={role === "doctor" ? "MCI-882140" : "you@email.com"}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    className="h-12 pl-9 pr-11 text-[15px]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow((s: boolean) => !s)}
                    className="tap-target absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground px-3"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <p role="alert" className="text-[13px] font-medium text-destructive">
                  {error}
                </p>
              ) : null}

              <Button type="submit" size="lg" className="h-12 w-full text-[15px] font-semibold" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                {loading ? "Signing in..." : role === "doctor" ? "Log In to Doctor Dashboard →" : "Log In to Patient Dashboard →"}
              </Button>

              <button type="button" className="text-[13px] font-medium text-primary text-center">
                Forgot Password?
              </button>
            </form>

            {role === "patient" && (
              <>
                <div className="my-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[12px] text-muted-foreground">Or continue with</span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="flex flex-col gap-2.5">
                  <Button variant="outline" className="h-11 w-full text-[14px]" onClick={() => navigate({ to: "/home" })}>
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="h-11 w-full text-[14px]" onClick={() => navigate({ to: "/home" })}>
                    <Phone className="size-4 mr-2" /> Login with Phone OTP
                  </Button>
                </div>
              </>
            )}

            <p className="mt-4 text-center text-[13px] text-muted-foreground">
              Don't have an account?{" "}
              <button type="button" className="font-semibold text-primary">
                Sign Up
              </button>
            </p>
          </CardContent>
        </Card>
      </Screen>
    </PhoneFrame>
  );
}
