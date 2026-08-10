import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Pin } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { announcementsQuery } from "@/lib/queries";

export const Route = createFileRoute("/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements — Topper Dream" },
      {
        name: "description",
        content:
          "Latest updates from Topper Dream: new PDF drops, test schedules and important JEE notices.",
      },
      { property: "og:title", content: "Announcements — Topper Dream" },
      {
        property: "og:description",
        content: "New PDF drops, test schedules and important JEE notices.",
      },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const { data, isLoading } = useQuery(announcementsQuery());

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Announcements</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Updates on new uploads, tests and schedule changes.
        </p>

        <div className="mt-8 space-y-4">
          {isLoading &&
            [0, 1].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-card" />
            ))}

          {data?.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  {a.pinned ? <Pin className="size-5" /> : <Megaphone className="size-5" />}
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold leading-snug">{a.title}</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {a.body}
                  </p>
                  <p className="mt-3 text-xs font-medium text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {!isLoading && data?.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
              No announcements yet.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
