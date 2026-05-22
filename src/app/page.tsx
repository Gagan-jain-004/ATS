import Link from "next/link";
import { ArrowRight, CheckCircle2, FileSearch, Layers3, Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeAuthActions } from "@/components/ats/home-auth-actions";

const featureCards = [
  {
    icon: FileSearch,
    title: "Resume intake",
    description: "Bulk upload PDF, DOC, and DOCX resumes, then parse and normalize them instantly."
  },
  {
    icon: Sparkles,
    title: "JD enhancement",
    description: "Short or vague job descriptions are enriched internally before semantic matching runs."
  },
  {
    icon: Layers3,
    title: "Smart matching",
    description: "Combine embeddings, skill overlap, and experience fit into one recruiter-ready score."
  },
  {
    icon: ShieldCheck,
    title: "Internal only",
    description: "Built for recruiter workflows only. No candidate signup, no public applications, no interview clutter."
  }
];

const workflowSteps = [
  "Create a job from rough hiring text or a full JD.",
  "Enhance only vague JDs and store the original plus the enriched version.",
  "Upload resumes, dedupe by email, phone, and hash, then score matches.",
  "Review candidates in a focused dashboard and update status in one click."
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_24%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-3xl border border-border bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-slate-950">TalentStream AI</p>
            <p className="text-sm text-slate-500">Internal recruiter ATS</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="rounded-xl shadow-glow">
              <Link href="/dashboard">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <HomeAuthActions variant="header" />
          </div>
        </header>

        <section className="grid flex-1 items-start gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-10">
          <div className="space-y-8 pt-2 animate-fadeUp lg:pt-4">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]">
                Recruiter workflow only
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  A faster internal ATS for teams that review resumes every day.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  TalentStream AI helps recruiters create jobs, enhance vague JDs, upload resumes, remove duplicates, and surface the strongest candidates with semantic matching.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl shadow-glow">
                <Link href="/dashboard">
                  Go to recruiter dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <HomeAuthActions variant="cta" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Job creation", "Paste rough hiring text and save the job in seconds."],
                ["Resume scoring", "Match % combines embeddings, skills, and experience."],
                ["Fast review", "Shortlist, decline, or approve without leaving the dashboard."]
              ].map(([title, description]) => (
                <Card key={title} className="border-border/80 bg-white/85">
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold text-slate-950">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="overflow-hidden border-border/80 bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
              <CardContent className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Today&apos;s pipeline</p>
                    <h2 className="mt-2 text-3xl font-bold">Recruiter dashboard</h2>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Match score</p>
                    <p className="text-2xl font-black text-white">82%</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Jobs", "12 active"],
                    ["Queued", "48 resumes"],
                    ["Shortlisted", "24 candidates"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                      <p className="mt-2 text-xl font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Internal workflow summary</p>
                      <p className="text-sm text-slate-300">Upload, parse, score, and review without switching tools.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="border-border/80 bg-white/90">
                    <CardContent className="p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-950">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-950">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-2 grid gap-4 rounded-[2rem] border border-border bg-white/80 p-6 shadow-sm backdrop-blur lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">How it works</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Simple recruiter flow</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The interface stays focused on internal hiring tasks: no candidate portal, no interview module, and no extra AI features that add noise.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-2xl border border-border bg-slate-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-600">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}