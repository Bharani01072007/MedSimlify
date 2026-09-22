import { createFileRoute } from "@tanstack/react-router";
import { Calendar, CheckCircle2, MapPin } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/lab-booking")({
  head: () => ({
    meta: [
      { title: "Book Lab Tests & Home Sample Collection — MedSimplify" },
      { name: "description", content: "Compare lab test prices, book home sample collection, and get reports directly in your app." },
      { property: "og:title", content: "Book Lab Tests — MedSimplify" },
      { property: "og:description", content: "Home sample collection and NABL lab price comparison." },
    ],
  }),
  component: LabBookingScreen,
});

const labPackages = [
  { name: "Full Body Checkup (65 Tests)", original: "₹2,500", discount: "₹999", lab: "Thyrocare NABL Lab" },
  { name: "Dengue Fever Profile (CBC + NS1 + IgM)", original: "₹1,200", discount: "₹599", lab: "Dr. Lal PathLabs" },
  { name: "Diabetes & Kidney Care Package", original: "₹1,800", discount: "₹799", lab: "Metropolis Healthcare" },
];

const nearbyLabs = [
  { name: "Dr. Lal PathLabs Center", dist: "1.1 km", rating: "4.9★", time: "Reports in 6 hrs" },
  { name: "Apollo Diagnostics", dist: "1.8 km", rating: "4.8★", time: "Reports in 8 hrs" },
];

function LabBookingScreen() {
  const [booked, setBooked] = useState<string | null>(null);

  const handleBook = (name: string) => {
    setBooked(name);
    toast.success(`Home sample collection booked for ${name}! Phlebotomist arriving tomorrow 7:30 AM.`);
  };

  return (
    <PhoneFrame>
      <PageHeader title="🏥 Book Lab Tests" subtitle="Home sample collection available" back="/reports" />
      <Screen withNav>
        <SectionTitle>🌟 Popular Checkup Packages</SectionTitle>
        <div className="flex flex-col gap-3">
          {labPackages.map((pkg) => (
            <Card key={pkg.name} className="border-primary/30 shadow-card">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-1">{pkg.lab}</Badge>
                    <p className="text-[17px] font-bold">{pkg.name}</p>
                    <p className="text-[13px] text-muted-foreground mt-1">Includes Home Sample Collection</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] line-through text-muted-foreground">{pkg.original}</span>
                    <p className="text-[18px] font-bold text-primary">{pkg.discount}</p>
                  </div>
                </div>
                <Button
                  className="mt-4 h-11 w-full text-[14px]"
                  onClick={() => handleBook(pkg.name)}
                >
                  <Calendar className="size-4" /> Book Home Sample (Tomorrow)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <SectionTitle>🏬 Nearby NABL Certified Labs</SectionTitle>
        <div className="flex flex-col gap-2">
          {nearbyLabs.map((lab) => (
            <Card key={lab.name} className="shadow-card">
              <CardContent className="flex items-center gap-3 py-4">
                <MapPin className="size-6 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{lab.name}</p>
                  <p className="text-[13px] text-muted-foreground">{lab.dist} · {lab.time}</p>
                </div>
                <span className="text-[13px] font-bold text-amber-600">{lab.rating}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {booked ? (
          <Card className="mt-4 border-success/40 bg-success/10 shadow-card">
            <CardContent className="py-4 text-center">
              <CheckCircle2 className="mx-auto size-8 text-success" />
              <p className="mt-2 text-[16px] font-bold">Booking Scheduled!</p>
              <p className="text-[14px] text-muted-foreground">Phlebotomist contact details will be sent via SMS.</p>
            </CardContent>
          </Card>
        ) : null}
      </Screen>
    </PhoneFrame>
  );
}
