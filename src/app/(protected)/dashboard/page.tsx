import { JobForm } from "@/components/ats/job-form";
import { JobGrid } from "@/components/ats/job-grid";
import { DebouncedSearchInput } from "@/components/ats/debounced-search";
// StatCards removed per simplified dashboard
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobs } from "@/lib/mock-store";
import { type JobSummary } from "@/lib/types";
// dashboardMetrics removed

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = await searchParams;
  const query = String(resolvedSearchParams.q ?? "").toLowerCase();
  const jobs = (await getJobs()).filter((job: JobSummary) => {
    if (!query) return true;
    return [job.title, job.city, job.description, job.enhancedJd].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <div className="grid gap-3 sm:items-end md:grid-cols-[minmax(0,1fr)_auto] md:justify-start">
        <div className="w-full">
          <DebouncedSearchInput paramName="q" placeholder="Search jobs..." defaultValue={query} />
        </div>
        <JobForm />
      </div>

      <Card className="border-border/80 bg-white/80 shadow-sm">
        <CardHeader className="space-y-1 pb-4 sm:pb-6">
          <div>
            <CardTitle className="text-lg sm:text-xl">Recruiter Job Board</CardTitle>
            <CardDescription className="text-sm sm:text-base">Open dashboards, shortlist candidates, and monitor each role’s status.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0 sm:px-6 sm:pb-6">
          <JobGrid jobs={jobs} />
        </CardContent>
      </Card>
    </div>
  );
}
