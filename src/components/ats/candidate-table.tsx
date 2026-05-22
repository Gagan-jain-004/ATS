"use client";

import { useState } from "react";
import { Mail, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CandidateDrawer } from "@/components/ats/candidate-drawer";
import { Progress } from "@/components/ui/progress";
import { type CandidateSummary } from "@/lib/types";

export function CandidateTable({ candidates, jobId }: { candidates: CandidateSummary[]; jobId: string }) {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateSummary | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="border-border/80 bg-white/95">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Candidate Name</th>
                  <th className="px-5 py-4">Match Score</th>
                  <th className="px-5 py-4">Key Skills</th>
                  <th className="px-5 py-4">Experience</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-t border-border/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">{candidate.fullName}</p>
                      <p className="text-xs text-slate-500">{candidate.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Progress value={candidate.matchPercentage} className="w-20" />
                        <span className="font-semibold text-slate-950">{candidate.matchPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700">{skill}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{candidate.experienceYears} Years</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline">{candidate.status}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setSelectedCandidate(candidate);
                          setOpen(true);
                        }} type="button" aria-label={`View ${candidate.fullName}`} title="View candidate details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`mailto:${candidate.email}`} aria-label={`Email ${candidate.fullName}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <CandidateDrawer candidate={selectedCandidate} jobId={jobId} open={open} onOpenChange={setOpen} />
    </>
  );
}
