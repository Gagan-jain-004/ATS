import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SearchFilters({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <form className="grid gap-3 rounded-3xl border border-border bg-white p-4 lg:grid-cols-5" method="get">
      <Input name="name" defaultValue={String(searchParams.name ?? "")} placeholder="Search by name" />
      <Input name="phone" defaultValue={String(searchParams.phone ?? "")} placeholder="Search by phone" />
      <Input name="skill" defaultValue={String(searchParams.skill ?? "")} placeholder="Search by skill" />
      <Select name="status" defaultValue={String(searchParams.status ?? "all")}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="UNREAD">Unread</SelectItem>
          <SelectItem value="READ">Read</SelectItem>
          <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
          <SelectItem value="APPROVED">Approved</SelectItem>
          <SelectItem value="DECLINED">Declined</SelectItem>
        </SelectContent>
      </Select>
      <Select name="experience" defaultValue={String(searchParams.experience ?? "all")}>
        <SelectTrigger>
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Experience</SelectItem>
          <SelectItem value="0-3">0-3 Years</SelectItem>
          <SelectItem value="3-5">3-5 Years</SelectItem>
          <SelectItem value="5-8">5-8 Years</SelectItem>
          <SelectItem value="8+">8+ Years</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" variant="outline" className="lg:col-span-5">Apply Filters</Button>
    </form>
  );
}
