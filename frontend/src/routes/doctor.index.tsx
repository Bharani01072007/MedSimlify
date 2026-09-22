import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import React, { useState } from "react";
import { PhoneFrame, Screen } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/doctor/")({
  head: () => ({
    meta: [
      { title: "Doctor login — MedSimplify" },
      {
        name: "description",
        content: "Doctors sign in to see today's appointments, patient records and write prescriptions.",
      },
      { property: "og:title", content: "Doctor login — MedSimplify" },
      { property: "og:description", content: "Sign in to the MedSimplify doctor workspace." },
    ],
  }),
  component: DoctorLogin,
});

function DoctorLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState("MCI-882140");
  const [password, setPassword] = useState("");

  return (
    <PhoneFrame>
      <Screen className="flex flex-col justify-center gap-6">
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Stethoscope className="size-8" />
          </div>
          <h1 className="mt-4 text-[24px] font-bold">MedSimplify for Doctors</h1>
          <p className="text-[14px] text-muted-foreground">
            Sign in with your medical registration ID
          </p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e: any) => {
            e.preventDefault();
            navigate({ to: "/doctor/dashboard" });
          }}
        >
          <div>
            <Label htmlFor="mci">Registration ID</Label>
            <Input
              id="mci"
              value={id}
              onChange={(e: any) => setId(e.target.value)}
              className="h-12 text-[16px]"
            />
          </div>
          <div>
            <Label htmlFor="dpass">Password</Label>
            <Input
              id="dpass"
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="h-12 text-[16px]"
            />
          </div>
          <Button type="submit" className="h-12 text-[16px]">
            Sign in
          </Button>
        </form>
        <Link
          to="/login"
          className="tap-target text-center text-[14px] text-muted-foreground underline"
        >
          I'm a patient
        </Link>
      </Screen>
    </PhoneFrame>
  );
}
