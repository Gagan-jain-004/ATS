"use client";

import { useEffect, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function DebouncedSearchInput({ paramName, placeholder, defaultValue = "" }: { paramName: string; placeholder: string; defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (value.trim()) {
        params.set(paramName, value.trim());
      } else {
        params.delete(paramName);
      }
      params.delete("page");
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [paramName, pathname, router, searchParams, startTransition, value]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
  );
}
