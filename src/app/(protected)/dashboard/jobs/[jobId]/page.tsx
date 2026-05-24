import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DebouncedSearchInput } from "@/components/ats/debounced-search";
import { EditJobDialog } from "@/components/ats/edit-job-dialog";
import { ResumeDropzone } from "@/components/ats/resume-dropzone";
import { CandidateTable } from "@/components/ats/candidate-table";
import { SearchFilters } from "@/components/ats/search-filters";
import { getCandidates, getJobById } from "@/lib/mock-store";
import { type CandidateSummary } from "@/lib/types";
import Link from "next/link";

function parseExperienceBand(value: string | undefined) {
  if (!value || value === "all") return [0, Infinity] as const;
  if (value === "8+") return [8, Infinity] as const;
  const [min, max] = value.split("-").map((part) => Number(part));
  return [min || 0, max || Infinity] as const;
}

function filterCandidates(candidates: CandidateSummary[], searchParams: Record<string, string | string[] | undefined>) {
  const name = String(searchParams.name ?? "").toLowerCase();
  const phone = String(searchParams.phone ?? "").toLowerCase();
  const skill = String(searchParams.skill ?? "").toLowerCase();
  const status = String(searchParams.status ?? "all");
  const experience = String(searchParams.experience ?? "all");
  const [minExperience, maxExperience] = parseExperienceBand(experience);

  return candidates.filter((candidate) => {
    const matchesName = !name || candidate.fullName.toLowerCase().includes(name);
    const matchesPhone = !phone || candidate.phone.toLowerCase().includes(phone);
    const matchesSkill = !skill || candidate.skills.some((entry) => entry.toLowerCase().includes(skill));
    const matchesStatus = status === "all" || candidate.status === status;
    const matchesExperience = candidate.experienceYears >= minExperience && candidate.experienceYears <= maxExperience;
    return matchesName && matchesPhone && matchesSkill && matchesStatus && matchesExperience;
  });
}

export default async function JobDashboardPage({ params, searchParams }: { params: Promise<{ jobId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const job = await getJobById(resolvedParams.jobId);
  if (!job) {
    notFound();
  }

  const buildPageHref = (page: number) => {
    const paramsObject = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (key === "page" || value == null || value === "") {
        continue;
      }

      paramsObject.set(key, String(value));
    }

    paramsObject.set("page", String(page));
    return `?${paramsObject.toString()}`;
  };

  const allCandidates = await getCandidates(resolvedParams.jobId);
  const candidates = filterCandidates(allCandidates, resolvedSearchParams);
  const selectedPage = Number(String(resolvedSearchParams.page ?? 1));
  const pageSize = 6;
  const start = Math.max((selectedPage - 1) * pageSize, 0);
  const paginatedCandidates = candidates.slice(start, start + pageSize);
  const totalPages = Math.max(Math.ceil(candidates.length / pageSize), 1);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="border-border/80 bg-white/90">
          <CardHeader className="pb-3">
            <Badge variant="secondary" className="w-fit">Active Role</Badge>
            <CardTitle className="text-2xl">Job Summary</CardTitle>
            <CardDescription>Current recruitment snapshot for the selected opening.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>{job.description}</p>
            <div className="space-y-2 rounded-2xl border border-border bg-slate-50 p-4">
              <div className="flex items-center justify-between"><span>Applicants</span><span className="font-semibold text-slate-950">{job.resumeCount}</span></div>
              <div className="flex items-center justify-between"><span>Shortlisted</span><span className="font-semibold text-slate-950">{job.shortlistedCount}</span></div>
            </div>
            <EditJobDialog job={job} />
          </CardContent>
        </Card>

        <ResumeDropzone jobId={resolvedParams.jobId} />
      </section>

      <Card className="border-border/80 bg-white/90">
        <CardHeader className="flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="text-2xl">All Applicants</CardTitle>
            <CardDescription>Search by name, phone, skill, status, match, and experience.</CardDescription>
          </div>
          <div className="w-full lg:max-w-md">
            <DebouncedSearchInput paramName="name" placeholder="Search candidates..." defaultValue={String(resolvedSearchParams.name ?? "")} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchFilters searchParams={resolvedSearchParams} />
          <CandidateTable candidates={paginatedCandidates} jobId={resolvedParams.jobId} />
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>
              Showing {start + 1}-{Math.min(start + pageSize, candidates.length)} of {candidates.length}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={selectedPage <= 1} asChild>
                <Link href={buildPageHref(Math.max(selectedPage - 1, 1))}>Previous</Link>
              </Button>
              <Button variant="outline" size="sm" disabled={selectedPage >= totalPages} asChild>
                <Link href={buildPageHref(Math.min(selectedPage + 1, totalPages))}>Next</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
