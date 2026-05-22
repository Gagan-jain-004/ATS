import { JobForm } from "@/components/ats/job-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewJobPage() {
  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:p-8">
      <Card className="border-border/80 bg-white/90">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Create Job</Badge>
          <CardTitle className="text-3xl">Simple JD Input</CardTitle>
          <CardDescription>Paste rough hiring text, LinkedIn copy, WhatsApp text, or a detailed JD. The system enhances only vague inputs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Use the dashboard add-job flow to capture structured fields, or open the quick-create dialog below.</p>
            <JobForm />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-border/80 bg-white/90">
          <CardHeader>
            <CardTitle className="text-lg">AI JD Checks</CardTitle>
            <CardDescription>Short or vague JDs are expanded internally for matching. Detailed JDs stay untouched.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Examples of enhancement targets: role title, core stack, seniority, experience band, and collaboration scope.</p>
            <p>The stored record keeps the original JD, enhanced JD, and embeddings for repeat semantic matching.</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-white/90">
          <CardHeader>
            <CardTitle className="text-lg">Internal Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>1. Recruiter pastes JD.</p>
            <p>2. AI evaluates detail level.</p>
            <p>3. Enhanced JD and embeddings are stored.</p>
            <p>4. Opening the job moves into resume processing.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
