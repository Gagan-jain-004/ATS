import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteJobButton } from "@/components/ats/delete-job-button";
import { type JobSummary } from "@/lib/types";

export function JobGrid({ jobs }: { jobs: JobSummary[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <Card key={job.id} className="group border-border/80 bg-white/90 transition hover:-translate-y-0.5 hover:shadow-lg">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {job.status}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500">Updated {job.lastUpdated}</span>
                </div>
                <h3 className="break-words text-lg font-semibold text-slate-950 sm:text-xl">{job.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <p className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.city}
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Created {job.createdAt}
                  </p>
                </div>
              </div>
              <div className="w-fit rounded-2xl bg-blue-50 px-3 py-2 text-sm text-blue-700 sm:text-right">
                <p className="font-semibold">{job.resumeCount} Resumes</p>
              </div>
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{job.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Shortlisted</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{job.shortlistedCount}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pending</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{job.pendingCount}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <DeleteJobButton jobId={job.id} />
                <span>Remove job</span>
              </div>
              <Button asChild size="sm" className="w-full rounded-xl sm:w-auto">
                <Link href={`/dashboard/jobs/${job.id}`}>
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
