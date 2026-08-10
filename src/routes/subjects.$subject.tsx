import { useMemo, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PdfCard } from "@/components/site/PdfCard";
import { EMPTY_FILTERS, FilterBar, type Filters } from "@/components/site/FilterBar";
import { publicMaterialsQuery } from "@/lib/queries";
import { SUBJECT_META, subjectFromSlug } from "@/lib/study";

export const Route = createFileRoute("/subjects/$subject")({
  beforeLoad: ({ params }) => {
    if (!subjectFromSlug(params.subject)) throw notFound();
  },
  head: ({ params }) => {
    const subject = subjectFromSlug(params.subject) ?? "Subject";
    const description = `${subject} JEE study materials — chapter-wise notes, DPPs, PYQs and practice PDFs updated daily.`;
    return {
      meta: [
        { title: `${subject} Materials — Topper Dream` },
        { name: "description", content: description },
        { property: "og:title", content: `${subject} Materials — Topper Dream` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SubjectPage,
});

function SubjectPage() {
  const { subject: slug } = Route.useParams();
  const subject = subjectFromSlug(slug)!;
  const meta = SUBJECT_META[subject]!;
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS, subject });
  const all = useQuery(publicMaterialsQuery({ subject }));

  const chapters = useMemo(
    () => Array.from(new Set((all.data ?? []).map((r) => r.chapter))).sort(),
    [all.data],
  );

  const results = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return (all.data ?? []).filter((m) => {
      if (term && !m.title.toLowerCase().includes(term) && !m.chapter.toLowerCase().includes(term))
        return false;
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
        <span className={`inline-block size-2.5 rounded-full ${meta.dot}`} />
        <h1 className={`mt-3 font-display text-3xl font-extrabold sm:text-4xl ${meta.accent}`}>
          {subject}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{meta.blurb}</p>

        <div className="mt-6">
          <FilterBar filters={filters} onChange={setFilters} chapters={chapters} lockSubject />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.isLoading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          {!all.isLoading && results.map((m) => <PdfCard key={m.id} material={m} />)}
        </div>

        {!all.isLoading && results.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No {subject} materials match these filters yet.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
