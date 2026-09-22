import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, MapPin, Phone } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { emergencyConditions, patient } from "@/lib/medsimplify-data";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency information — MedSimplify" },
      {
        name: "description",
        content: "One-tap emergency numbers, your medical ID card, warning signs and the nearest hospital.",
      },
      { property: "og:title", content: "Emergency information — MedSimplify" },
      { property: "og:description", content: "Emergency numbers, medical ID and warning signs in one place." },
    ],
  }),
  component: EmergencyScreen,
});

function EmergencyScreen() {
  return (
    <PhoneFrame>
      <PageHeader title="🚨 Emergency" back="/home" />
      <Screen withNav>
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="h-20 bg-destructive text-[18px] font-bold text-destructive-foreground hover:bg-destructive/90"
            onClick={() => toast("Calling ambulance 108")}
          >
            <Phone className="size-5" /> Call 108
          </Button>
          <Button
            variant="outline"
            className="h-20 border-destructive text-[18px] font-bold text-destructive"
            onClick={() => toast("Calling emergency 112")}
          >
            <Phone className="size-5" /> Call 112
          </Button>
        </div>
        <SectionTitle>My medical ID</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="grid grid-cols-2 gap-3 pt-6 text-[16px]">
            <Info label="Name" value={patient.name} />
            <Info label="Age / Sex" value={patient.age} />
            <Info label="Blood group" value={patient.bloodGroup} />
            <Info label="Allergies" value={patient.allergies} />
            <div className="col-span-2">
              <Info label="Current condition" value="Dengue fever, platelets 80,000" />
            </div>
            <div className="col-span-2">
              <Info label="Emergency contact" value={patient.emergencyContact} />
            </div>
          </CardContent>
        </Card>
        <Button
          variant="outline"
          className="mt-3 h-12 w-full text-[16px]"
          onClick={() => toast("Calling emergency contact")}
        >
          <Phone className="size-4" /> Call emergency contact
        </Button>
        <SectionTitle>Warning signs — go to hospital now</SectionTitle>
        <div className="flex flex-col gap-3">
          {emergencyConditions.map((c) => (
            <Card key={c.name} className="border-destructive/30 shadow-card">
              <CardContent className="pt-6">
                <p className="flex items-center gap-2 text-[16px] font-bold text-destructive">
                  <AlertTriangle className="size-4" /> {c.name}
                </p>
                <ul className="mt-2 list-disc pl-5 text-[16px]">
                  {c.signs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <SectionTitle>Nearest hospital</SectionTitle>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-[16px] font-semibold">City Hospital — Emergency Ward</p>
            <p className="text-[14px] text-muted-foreground">2.3 km away · open 24 hours · MG Road</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-11" onClick={() => toast("Opening directions")}>
                <MapPin className="size-4" /> Directions
              </Button>
              <Button variant="outline" className="h-11" onClick={() => toast("Calling hospital")}>
                <Phone className="size-4" /> Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </Screen>
    </PhoneFrame>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[14px] text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
