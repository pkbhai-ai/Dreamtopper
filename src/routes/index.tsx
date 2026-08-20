import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, CalendarDays, Layers, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PdfCard } from "@/components/site/PdfCard";
import { publicMaterialsQuery, statsQuery, subjectCountsQuery } from "@/lib/queries";
import { SUBJECTS, SUBJECT_META, todayISO } from "@/lib/study";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Topper Dream — Daily JEE Study Material PDFs" },
      {
        name: "description",
        content:
          "Daily JEE notes, DPPs, PYQs and practice PDFs for Physics, Chemistry and Mathematics. Search, open and download in one tap.",
      },
      { property: "og:title", content: "Topper Dream — Daily JEE Study Material PDFs" },
      {
        property: "og:description",
        content: "Daily JEE notes, DPPs, PYQs and practice PDFs — all in one place.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const today = todayISO();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const latest = useQuery(publicMaterialsQuery({ limit: 6 }));
  const stats = useQuery(statsQuery(today));
  const counts = useQuery(subjectCountsQuery());

  const statItems = [
    { icon: BookOpen, label: "Total PDFs", value: stats.data?.total ?? 0 },
    { icon: CalendarDays, label: "New Today", value: stats.data?.today ?? 0 },
    { icon: Layers, label: "Subjects Covered", value: stats.data?.subjects ?? 0 },
    { icon: Users, label: "Active Students", value: "Growing" as const },
  ];

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    navigate({ to: "/daily", search: q ? { q } : {} });
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="surface-navy">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="fade-up max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
              JEE Main + Advanced
            </span>
            <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
              <span className="text-gradient-gold">Topper Dream</span>
            </h1>
            <p className="mt-3 font-display text-xl font-bold leading-snug text-navy-foreground sm:text-3xl">
              Study material that arrives before your doubts do.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
              Daily JEE notes, PYQs and practice PDFs — organised subject-wise and updated every
              single day.
            </p>

            <form onSubmit={submitSearch} className="mt-8 max-w-xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search notes, chapters, PYQs..."
                  aria-label="Search study materials"
                  className="h-14 rounded-2xl border-transparent bg-card pl-11 pr-28 text-base shadow-lift"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl px-4"
                >
                  Search
                </Button>
              </div>
            </form>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-gold text-gold-foreground transition-transform hover:-translate-y-0.5 hover:bg-gold/90 active:translate-y-0"
              >
                <Link to="/daily">
                  View Today's PDFs <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-navy-foreground/25 bg-transparent text-navy-foreground transition-transform hover:-translate-y-0.5 hover:bg-navy-foreground/10 hover:text-navy-foreground active:translate-y-0"
              >
                <Link to="/subjects">Browse Subjects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 shadow-lift lg:grid-cols-4 lg:p-6">
          {statItems.map((s) => (
            <div key={s.label} className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <s.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl font-extrabold leading-none">
                  {stats.isLoading ? "—" : s.value}
                </p>
                <p className="mt-1 truncate text-xs font-medium text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Featured Subjects</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick your subject and get straight to the chapter you are revising today.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((subject) => {
            const meta = SUBJECT_META[subject]!;
            const c = counts.data?.[subject];
            return (
              <Link
                key={subject}
                to="/daily"
                search={{ subject }}
                className="card-lift group rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className={`inline-block size-2.5 rounded-full ${meta.dot}`} />
                <h3 className={`mt-4 font-display text-xl font-bold ${meta.accent}`}>{subject}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{meta.blurb}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {counts.isLoading
                    ? "Loading…"
                    : `${c?.pdfs ?? 0} PDFs · ${c?.chapters ?? 0} chapters`}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  Open materials
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Latest Uploads</h2>
            <p className="mt-2 text-sm text-muted-foreground">Freshly added study PDFs.</p>
          </div>
          <Button asChild variant="ghost" className="rounded-xl">
            <Link to="/daily">See all</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.isLoading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          {latest.data?.map((m) => <PdfCard key={m.id} material={m} />)}
        </div>

        {latest.data?.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No PDFs uploaded yet. Check back soon — new material is added daily.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
