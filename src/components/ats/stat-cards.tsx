import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function StatCards({ metrics }: { metrics: { totalHires: number; avgMatchScore: number; processingQueue: number } }) {
  const cards = [
    { label: "Total Hires", value: metrics.totalHires.toString(), tone: "text-slate-950" },
    { label: "Avg Match Score", value: `${metrics.avgMatchScore}%`, tone: "text-slate-950" },
    { label: "Processing Queue", value: metrics.processingQueue.toString(), tone: "text-slate-950" }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label} className="overflow-hidden border-border/80 bg-white/90">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-wide">
                AI
              </Badge>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
              <p className={`text-3xl font-extrabold ${card.tone}`}>{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
