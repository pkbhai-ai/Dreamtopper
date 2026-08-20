import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PdfCard } from "@/components/site/PdfCard";
import { EMPTY_FILTERS, FilterBar, type Filters } from "@/components/site/FilterBar";
import { publicMaterialsQuery } from "@/lib/queries";

export const Route = createFileRoute("/daily")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search['q'] === "string" ? (search['q'] as string) : undefined,
    subject: typeof search['subject'] === "string" ? (search['subject'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Daily PDFs — Topper Dream JEE Materials" },
      {
        name: "description",
        content:
          "Browse and download today's JEE PDFs. Filter by subject, chapter, material type and date.",
      },
      { property: "og:title", content: "Daily PDFs — Topper Dream JEE Materials" },
      {
        property: "og:description",
        content: "Filter JEE notes, DPPs and PYQs by subject, chapter, type and date.",
      },
    ],
  }),
  component: DailyPage,
});

function DailyPage() {
  const { q, subject } = Route.useSearch();
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    search: q ?? "",
    subject: subject ?? "",
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: q ?? "", subject: subject ?? "" }));
  }, [q, subject]);
  const all = useQuery(publicMaterialsQuery());

  const chapters = useMemo(() => {
    const rows = all.data ?? [];
    const scoped = filters.subject ? rows.filter((r) => r.subject === filters.subject) : rows;
    return Array.from(new Set(scoped.map((r) => r.chapter))).sort();
  }, [all.data, filters.subject]);

  const results = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return (all.data ?? []).filter((m) => {
      if (term) {
        const haystack = [m.title, m.subject, m.chapter, m.material_type, m.description ?? ""]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (filters.subject && m.subject !== filters.subject) return false;
      if (filters.chapter && m.chapter !== filters.chapter) return false;
      if (filters.type && m.material_type !== filters.type) return false;
      if (filters.date && m.material_date !== filters.date) return false;
      return true;
    });
  }, [all.data, filters]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Daily PDFs</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Every note, DPP and PYQ we publish — searchable and filterable.
        </p>

        <div className="mt-6">
          <FilterBar filters={filters} onChange={setFilters} chapters={chapters} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {all.isLoading ? "Loading…" : `${results.length} material${results.length === 1 ? "" : "s"}`}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.isLoading &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          {!all.isLoading && results.map((m) => <PdfCard key={m.id} material={m} />)}
        </div>

        {!all.isLoading && results.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No PDFs match these filters. Try clearing the search or picking another date.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
