import { JobForm } from "@/components/ats/job-form";
import { JobGrid } from "@/components/ats/job-grid";
import { DebouncedSearchInput } from "@/components/ats/debounced-search";
// StatCards removed per simplified dashboard
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobs } from "@/lib/mock-store";
// dashboardMetrics removed

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = await searchParams;
  const query = String(resolvedSearchParams.q ?? "").toLowerCase();
  const jobs = (await getJobs()).filter((job) => {
    if (!query) return true;
    return [job.title, job.city, job.description, job.enhancedJd].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-start">
        <div className="w-full md:max-w-md">
          <DebouncedSearchInput paramName="q" placeholder="Search jobs..." defaultValue={query} />
        </div>
        <JobForm />
      </div>

      <Card className="border-border/80 bg-white/80">
        <CardHeader>
          <div>
            <CardTitle className="text-xl">Recruiter Job Board</CardTitle>
            <CardDescription>Open dashboards, shortlist candidates, and monitor each role’s status.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <JobGrid jobs={jobs} />
        </CardContent>
      </Card>
    </div>
  );
}
