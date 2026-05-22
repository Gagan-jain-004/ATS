"use client";

import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export default function MatchExplainDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="rounded-xl border border-slate-900/10 bg-slate-950 px-4 font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:text-white focus-visible:ring-slate-950"
        >
          <Info className="mr-2 h-4 w-4" /> How matching works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How Candidate Matching Works</DialogTitle>
          <DialogDescription>A short summary of the signals we extract from resumes and how the final match percentage is computed.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4 text-sm text-slate-700">
          <section>
            <h4 className="font-semibold">What we extract from resumes</h4>
            <ul className="mt-2 list-disc pl-5">
              <li>Contact details (email, phone) & basic metadata (upload date).</li>
              <li>Parsed plain-text of the resume for semantic analysis.</li>
              <li>Detected skills and keywords (from a curated skill list).</li>
              <li>Reported years of experience and education/role hints.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold">How we score a candidate</h4>
            <ul className="mt-2 list-disc pl-5">
              <li>Semantic similarity (embedding cosine similarity) between the job and resume text — captures phrasing and related concepts.</li>
              <li>Skill overlap — fraction of job skills present in the resume (exact and normalized matches).</li>
              <li>Experience alignment — whether the candidate's years align with the job band (penalizes under-experience).</li>
              <li>Composite score = 50% semantic + 35% skills + 15% experience, then clamped to 0–100.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold">Why results may vary</h4>
            <ul className="mt-2 list-disc pl-5">
              <li>Resumes with more detailed role descriptions generate stronger semantic signals.</li>
              <li>Different wording or synonyms may still match via embeddings even without exact skill text.</li>
              <li>Short resumes or sparse skill lists reduce confidence (embedding fallback uses token heuristics).</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold">How recruiters can improve matches</h4>
            <ul className="mt-2 list-disc pl-5">
              <li>Update the job skills and description to be explicit about required technologies and seniority.</li>
              <li>Add a location and experience band to the job to improve filtering.</li>
              <li>Use the "Edit Job" flow to refresh candidate scoring after edits — scores are recomputed automatically.</li>
            </ul>
          </section>

          <p className="text-xs text-slate-500">This is an explainable summary; the exact numeric weighting and matching heuristics are implemented server-side and may be adjusted over time.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
