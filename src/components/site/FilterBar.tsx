import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MATERIAL_TYPES, SUBJECTS } from "@/lib/study";

export type Filters = {
  search: string;
  subject: string;
  chapter: string;
  date: string;
  type: string;
};

export const EMPTY_FILTERS: Filters = {
  search: "",
  subject: "",
  chapter: "",
  date: "",
  type: "",
};

const selectClass =
  "h-11 w-full rounded-xl border border-input bg-card px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring";

export function FilterBar({
  filters,
  onChange,
  chapters,
  lockSubject = false,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  chapters: string[];
  lockSubject?: boolean;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search by title, e.g. Rotational Motion DPP"
          className="h-11 rounded-xl pl-9"
          aria-label="Search PDFs by title"
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {!lockSubject && (
          <select
            className={selectClass}
            value={filters.subject}
            onChange={(e) => set({ subject: e.target.value, chapter: "" })}
            aria-label="Filter by subject"
          >
            <option value="">All subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        <select
          className={selectClass}
          value={filters.chapter}
          onChange={(e) => set({ chapter: e.target.value })}
          aria-label="Filter by chapter"
        >
          <option value="">All chapters</option>
          {chapters.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={filters.type}
          onChange={(e) => set({ type: e.target.value })}
          aria-label="Filter by material type"
        >
          <option value="">All types</option>
          {MATERIAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <input
          type="date"
          className={selectClass}
          value={filters.date}
          onChange={(e) => set({ date: e.target.value })}
          aria-label="Filter by date"
        />
      </div>

      <button
        type="button"
        onClick={() => onChange({ ...EMPTY_FILTERS, subject: lockSubject ? filters.subject : "" })}
        className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}
