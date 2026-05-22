"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const shouldDelete = window.confirm("Delete this job and all related candidates?");
    if (!shouldDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        return;
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full border border-rose-100 bg-white/90 text-rose-600 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
      disabled={isDeleting}
      onClick={() => void handleDelete()}
      aria-label="Delete job"
      title="Delete job"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
