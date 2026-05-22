"use client";

import { useEffect, useState, useTransition } from "react";
import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { type JobSummary } from "@/lib/types";

function parseExperienceYears(job: JobSummary) {
  const match = job.enhancedJd.match(/(\d+)\+?\s*(?:years?|yrs?)/i) ?? job.description.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
  return match ? match[1] : "";
}

function parseSkills(job: JobSummary) {
  const source = job.skills.length ? job.skills : job.enhancedJd.split(/[\n,]/).map((entry) => entry.trim()).filter(Boolean);
  return source.join(", ");
}

export function EditJobDialog({ job }: { job: JobSummary }) {
  const router = useRouter();
  const [title, setTitle] = useState(job.title);
  const [city, setCity] = useState(job.city);
  const [skills, setSkills] = useState(parseSkills(job));
  const [experienceYears, setExperienceYears] = useState(parseExperienceYears(job));
  const [description, setDescription] = useState(job.description);
  const [open, setOpen] = useState(false);
  const [isSaving, startSaving] = useTransition();

  useEffect(() => {
    if (!open) return;
    setTitle(job.title);
    setCity(job.city);
    setSkills(parseSkills(job));
    setExperienceYears(parseExperienceYears(job));
    setDescription(job.description);
  }, [job, open]);

  async function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !trimmedDescription) return;

    startSaving(async () => {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
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

      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full rounded-xl">
          <PencilLine className="h-4 w-4" /> Edit JD
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>Update the structured job details and refresh candidate matching from the revised JD.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the role, responsibilities, team setup, and must-have qualities..."
              className="min-h-[220px]"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="rounded-xl" disabled={isSaving || !title.trim() || !description.trim()} onClick={() => void handleSave()}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
