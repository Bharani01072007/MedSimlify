import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Pencil, Phone, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader, PhoneFrame, Screen } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAppointmentsApi, scheduleAppointmentApi } from "@/lib/api-client";
import { appointments as seed } from "@/lib/medsimplify-data";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "My appointments — MedSimplify" },
      { name: "description", content: "Upcoming and past doctor visits with directions, call buttons and what to bring." },
      { property: "og:title", content: "My appointments — MedSimplify" },
      { property: "og:description", content: "Your next visit, with directions and preparation notes." },
    ],
  }),
  component: AppointmentsScreen,
});

interface Appt {
  id: string;
  doctor: string;
  specialty: string;
  when: string;
  location: string;
  type: string;
  prep: string;
  status?: "upcoming" | "past";
}

function AppointmentsScreen() {
  const [tab, setTab] = useState("upcoming");
  const [upcoming, setUpcoming] = useState<Appt[]>(seed.upcoming as any);
  const [past, setPast] = useState<any[]>(seed.past);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const live = await getAppointmentsApi(1);
        if (Array.isArray(live) && live.length > 0) {
          const upcomingMapped: Appt[] = live
            .filter((a: any) => a.status !== "completed" && a.status !== "past")
            .map((a: any) => ({
              id: String(a.id),
              doctor: a.doctor_name || a.doctor || "Dr. Priya Sharma",
              specialty: a.specialty || "General Medicine",
              when: a.appointment_time || a.when || a.scheduled_at || "Scheduled",
              location: a.location || "City Hospital",
              type: a.reason || a.type || "Follow-up",
              prep: a.preparation || "Bring all lab reports",
              status: "upcoming" as const,
            }));
          if (upcomingMapped.length > 0) setUpcoming(upcomingMapped);

          const pastMapped = live
            .filter((a: any) => a.status === "completed" || a.status === "past")
            .map((a: any) => ({
              id: String(a.id),
              doctor: a.doctor_name || "Dr. Priya Sharma",
              when: a.appointment_time || a.scheduled_at || "Past",
              note: a.notes || a.reason || "Consultation",
            }));
          if (pastMapped.length > 0) setPast(pastMapped);
        }
      } catch (err) {
        console.warn("Appointments API fallback:", err);
      }
    }
    loadAppointments();
  }, []);

  async function bookAppointment() {
    setBooking(true);
    try {
      const res = await scheduleAppointmentApi(1, 1, "General Consultation");
      toast.success(
        `✅ Appointment booked! ${res?.scheduled_at || "Dr. Priya Sharma will confirm shortly."}`
      );
      // Refresh list
      const live = await getAppointmentsApi(1);
      if (Array.isArray(live) && live.length > 0) {
        setUpcoming(live.filter((a: any) => a.status !== "completed").map((a: any) => ({
          id: String(a.id),
          doctor: a.doctor_name || "Dr. Priya Sharma",
          specialty: a.specialty || "General Medicine",
          when: a.appointment_time || "Scheduled",
          location: a.location || "City Hospital",
          type: a.reason || "Follow-up",
          prep: "Bring all lab reports",
          status: "upcoming" as const,
        })));
      }
    } catch {
      toast.success("Booking request sent — Dr. Priya Sharma will confirm shortly.");
    } finally {
      setBooking(false);
    }
  }

  return (
    <PhoneFrame>
      <PageHeader title="📅 My Appointments" back="/home" />
      <Screen withNav>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab !== "past" ? (
          <div className="mt-4 flex flex-col gap-3">
            {upcoming.map((a) => (
              <Card key={a.id} className="border-primary/30 shadow-card">
                <CardContent className="pt-6">
                  <Badge className="mb-2">Next visit</Badge>
                  <p className="text-[20px] font-bold">{a.doctor}</p>
                  <p className="text-[14px] text-muted-foreground">{a.specialty}</p>

                  <div className="mt-3 flex flex-col gap-2 text-[16px]">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-primary" /> {a.when}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" /> {a.location}
                    </p>
                  </div>

                  <p className="mt-3 text-[14px]">{a.type}</p>
                  <p className="caption-text">Preparation: {a.prep}</p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Button variant="outline" className="h-11 text-[14px]" onClick={() => toast("Opening maps")}>
                      <MapPin className="size-4" />
                    </Button>
                    <Button variant="outline" className="h-11 text-[14px]" onClick={() => toast("Calling clinic")}>
                      <Phone className="size-4" />
                    </Button>
                    <Button variant="outline" className="h-11 text-[14px]" onClick={() => toast.success("Reschedule request sent")}>
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-warning/50 bg-warning/10 shadow-card">
              <CardContent className="py-4">
                <p className="text-[15px] font-bold text-foreground">📋 Pre-Visit Checklist & Fasting Prep:</p>
                <ul className="mt-2 list-disc pl-5 text-[14px] space-y-1">
                  <li>Fast for 8–10 hours before morning blood test (water is allowed)</li>
                  <li>Bring all lab reports from the last 3 months</li>
                  <li>Carry a list of current medicines and daily dosages</li>
                  <li>Arrive 15 minutes prior to appointment time</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {tab !== "upcoming" ? (
          <div className="mt-4 flex flex-col gap-3">
            <h3 className="text-[18px] font-bold">Past visits</h3>
            {past.map((a) => (
              <Card key={a.id} className="shadow-card">
                <CardContent className="flex items-center gap-3 pt-6">
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-semibold">{a.doctor}</p>
                    <p className="caption-text">{a.when} · {a.note}</p>
                  </div>
                  <Button variant="outline" className="h-11 text-[14px]" onClick={() => toast("Opening visit summary")}>
                    View summary
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        <Button
          className="mt-6 h-12 w-full text-[16px]"
          disabled={booking}
          onClick={bookAppointment}
        >
          <Plus className="size-4" /> {booking ? "Booking…" : "Book new appointment"}
        </Button>
      </Screen>
    </PhoneFrame>
  );
}
