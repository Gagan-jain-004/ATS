"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function JobForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  async function handleSubmit() {
    const trimmedDescription = description.trim();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !trimmedDescription) return;

    setIsPending(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: trimmedTitle,
          city: city.trim(),
          skills: skills
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean),
          experienceYears: experienceYears ? Number(experienceYears) : undefined,
          description: trimmedDescription
        })
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (data?.job?.id) {
        router.push(`/dashboard/jobs/${data.job.id}`);
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full rounded-xl shadow-glow sm:w-auto">
          <Sparkles className="h-4 w-4" /> Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>Capture the fields recruiters care about so matching works better from the start.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Job Title</label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Senior Java Developer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">City / Location</label>
              <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Remote / London / New York" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Required Skills</label>
              <Input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Java, Spring Boot, PostgreSQL, REST APIs" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Experience Required (years)</label>
              <Input value={experienceYears} onChange={(event) => setExperienceYears(event.target.value)} placeholder="5" inputMode="numeric" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Job Description</label>
            <Textarea
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the role, responsibilities, team setup, and must-have qualities..."
              className="min-h-[220px]"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={isPending}
              onClick={() => void handleSubmit()}
            >
              {isPending ? "Saving..." : "Save Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
