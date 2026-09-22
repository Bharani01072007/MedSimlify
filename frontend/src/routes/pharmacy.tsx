import { createFileRoute } from "@tanstack/react-router";
import { Check, ShoppingBag, Truck } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/pharmacy")({
  head: () => ({
    meta: [
      { title: "Order Medicines & Pharmacy — MedSimplify" },
      { name: "description", content: "Order medicines online, compare pharmacy prices, find generic alternatives and track home delivery." },
      { property: "og:title", content: "Order Medicines & Pharmacy — MedSimplify" },
      { property: "og:description", content: "Compare pharmacy prices, generic alternatives and instant delivery." },
    ],
  }),
  component: PharmacyScreen,
});

const pharmacies = [
  { name: "Apollo Pharmacy", dist: "0.8 km", time: "30 mins", price: "₹180", rating: "4.8★" },
  { name: "MedPlus Pharmacy", dist: "1.2 km", time: "45 mins", price: "₹165", rating: "4.7★" },
  { name: "Netmeds Direct", dist: "Express Delivery", time: "2 hours", price: "₹150", rating: "4.9★" },
];

const genericAlternatives = [
  { brand: "Dolo 650mg", generic: "Paracetamol 650mg", savings: "Save 40% (₹15 vs ₹25)" },
  { brand: "Pan 40mg", generic: "Pantoprazole 40mg", savings: "Save 50% (₹35 vs ₹70)" },
];

function PharmacyScreen() {
  const [query, setQuery] = useState("");
  const [ordered, setOrdered] = useState(false);

  const handleOrder = (name: string) => {
    setOrdered(true);
    toast.success(`Order placed with ${name}! Delivery in 30-45 mins.`);
  };

  return (
    <PhoneFrame>
      <PageHeader title="🚚 Medicine Delivery" subtitle="Compare prices & order online" back="/medicines" />
      <Screen withNav>
        <div className="relative">
          <Input
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            placeholder="Search medicine or upload prescription..."
            className="h-12 pl-4 text-[16px]"
          />
        </div>

        <SectionTitle>💡 Generic Alternatives (Money Saver)</SectionTitle>
        <div className="flex flex-col gap-2">
          {genericAlternatives.map((g) => (
            <Card key={g.brand} className="border-success/30 bg-success/5 shadow-card">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-bold text-foreground">{g.brand} ➔ {g.generic}</p>
                  <Badge variant="secondary" className="text-success">{g.savings}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <SectionTitle>🏪 Nearby Pharmacies & Price Comparison</SectionTitle>
        <div className="flex flex-col gap-3">
          {pharmacies.map((p) => (
            <Card key={p.name} className="shadow-card">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShoppingBag className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[16px] font-semibold">{p.name}</p>
                    <span className="text-[12px] font-bold text-amber-600">{p.rating}</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground">{p.dist} · {p.time} delivery</p>
                  <p className="text-[14px] font-bold text-primary mt-1">Total: {p.price}</p>
                </div>
                <Button
                  className="h-11 text-[14px]"
                  onClick={() => handleOrder(p.name)}
                >
                  <Truck className="size-4" /> Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {ordered ? (
          <Card className="mt-4 border-success/40 bg-success/10 shadow-card">
            <CardContent className="py-4 text-center">
              <Check className="mx-auto size-8 text-success" />
              <p className="mt-2 text-[16px] font-bold">Order Confirmed!</p>
              <p className="text-[14px] text-muted-foreground">Pharmacy is packing your prescription medicines.</p>
            </CardContent>
          </Card>
        ) : null}
      </Screen>
    </PhoneFrame>
  );
}
