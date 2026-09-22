import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { EmptyState, PageHeader, PhoneFrame, Screen } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { familyMembers as seed } from "@/lib/medsimplify-data";
import { getFamilyMembersApi, addFamilyMemberApi } from "@/lib/api-client";

export const Route = createFileRoute("/family")({
  head: () => ({
    meta: [
      { title: "Family members — MedSimplify" },
      {
        name: "description",
        content: "Keep reports and medicines for your whole family in one account and switch between profiles.",
      },
      { property: "og:title", content: "Family members — MedSimplify" },
      { property: "og:description", content: "Manage health records for your whole family." },
    ],
  }),
  component: FamilyScreen,
});

function FamilyScreen() {
  const [members, setMembers] = useState(seed);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  async function loadFamilyMembers() {
    try {
      const data = await getFamilyMembersApi(1);
      if (data && data.length > 0) {
        setMembers(data);
      }
    } catch {
      // Keep seed fallback if backend is offline
    }
  }

  const add = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    setSubmitting(true);
    try {
      const added = await addFamilyMemberApi({
        name: name.trim(),
        relationship: relation || "Family",
        age: age || "—"
      }, 1);

      if (added) {
        setMembers((m) => [...m, added]);
        toast.success("Family member added & saved to database");
      }
    } catch {
      // Optimistic fallback
      setMembers((m) => [
        ...m,
        { id: `f${m.length + 1}`, name: name.trim(), relation: relation || "Family", age: age || "—", reports: 0 },
      ]);
      toast.success("Family member added");
    } finally {
      setName("");
      setRelation("");
      setAge("");
      setOpen(false);
      setSubmitting(false);
    }
  };

  return (
    <PhoneFrame>
      <PageHeader title="👨‍👩‍👧 Family" back="/profile" />
      <Screen withNav>
        {members.length === 0 ? (
          <EmptyState
            icon={<UserPlus className="size-6" />}
            title="No family members yet"
            message="Add your family so their reports and medicines stay in one place."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <Card key={m.id} className="shadow-card">
                <CardContent className="flex items-center gap-3 pt-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-[18px] font-bold text-primary">
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-semibold">{m.name}</p>
                    <p className="text-[14px] text-muted-foreground">
                      {m.relation} · {m.age}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[14px] text-muted-foreground">
                      <FileText className="size-4" /> {m.reports} reports
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="h-11 text-[14px]"
                    onClick={() => toast(`Switched to ${m.name}`)}
                  >
                    Switch
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-6 h-12 w-full text-[16px]">
              <Plus className="size-4" /> Add family member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[360px]">
            <DialogHeader>
              <DialogTitle>Add family member</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div>
                <Label htmlFor="fname">Full name</Label>
                <Input id="fname" value={name} onChange={(e: any) => setName(e.target.value)} className="h-12" />
              </div>
              <div>
                <Label htmlFor="frel">Relation</Label>
                <Input
                  id="frel"
                  value={relation}
                  onChange={(e: any) => setRelation(e.target.value)}
                  placeholder="Wife, Son, Mother..."
                  className="h-12"
                />
              </div>
              <div>
                <Label htmlFor="fage">Age &amp; sex</Label>
                <Input
                  id="fage"
                  value={age}
                  onChange={(e: any) => setAge(e.target.value)}
                  placeholder="32F"
                  className="h-12"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="h-12 w-full text-[16px]" disabled={submitting} onClick={add}>
                {submitting ? "Saving..." : "Add member"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Screen>
    </PhoneFrame>
  );
}
