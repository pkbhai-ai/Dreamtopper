import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { publicMaterialsQuery } from "@/lib/queries";
import { SUBJECTS, SUBJECT_META } from "@/lib/study";

export const Route = createFileRoute("/subjects/")({
  head: () => ({
    meta: [
      { title: "Subjects — Physics, Chemistry & Maths | Topper Dream" },
      {
        name: "description",
        content:
          "Explore JEE study materials by subject: Physics, Chemistry and Mathematics chapter-wise notes, DPPs and PYQs.",
      },
      { property: "og:title", content: "Subjects — Physics, Chemistry & Maths | Topper Dream" },
      {
        property: "og:description",
        content: "Chapter-wise JEE notes, DPPs and PYQs across all three subjects.",
      },
    ],
  }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const all = useQuery(publicMaterialsQuery());

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Subjects</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Choose a subject to see its chapters and materials.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SUBJECTS.map((subject) => {
            const meta = SUBJECT_META[subject]!;
            const rows = (all.data ?? []).filter((m) => m.subject === subject);
            const chapters = new Set(rows.map((r) => r.chapter)).size;
            return (
              <Link
                key={subject}
                to="/subjects/$subject"
                params={{ subject: meta.slug }}
                className="card-lift group rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className={`inline-block size-2.5 rounded-full ${meta.dot}`} />
                <h2 className={`mt-4 font-display text-xl font-bold ${meta.accent}`}>{subject}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{meta.blurb}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {rows.length} PDFs · {chapters} chapters
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Open
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
