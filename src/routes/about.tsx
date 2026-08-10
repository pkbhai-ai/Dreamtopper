import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, ShieldCheck, Target } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Topper Dream — Our JEE Mission" },
      {
        name: "description",
        content:
          "Topper Dream gives JEE aspirants free, well-organised daily study PDFs — notes, DPPs and PYQs across Physics, Chemistry and Maths.",
      },
      { property: "og:title", content: "About Topper Dream — Our JEE Mission" },
      {
        property: "og:description",
        content: "Free, well-organised daily JEE study PDFs for serious aspirants.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Clock,
    title: "Daily consistency",
    body: "New material every day so your revision never stalls.",
  },
  {
    icon: BookOpen,
    title: "Chapter-wise clarity",
    body: "Every PDF is tagged by subject, chapter and type — no hunting.",
  },
  {
    icon: Target,
    title: "Exam-focused",
    body: "Built around the JEE Main and Advanced syllabus and weightage.",
  },
  {
    icon: ShieldCheck,
    title: "Free and clean",
    body: "No clutter, no paywalls. Just open the PDF and study.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">About Topper Dream</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Topper Dream started with one simple frustration: JEE aspirants waste hours every week
          searching scattered groups and drives for the right notes. We fixed that by publishing
          clean, chapter-tagged study PDFs in one place — every single day.
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Whether you need a quick formula sheet before a mock, a chapter DPP after class, or ten
          years of PYQs for a weak topic, it's already organised and ready to download.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <v.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold">{v.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
