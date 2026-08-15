import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send } from "lucide-react";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Topper Dream — Request Study Material" },
      {
        name: "description",
        content:
          "Reach the Topper Dream team to request a chapter PDF, report a broken file or share feedback.",
      },
      { property: "og:title", content: "Contact Topper Dream — Request Study Material" },
      {
        property: "og:description",
        content: "Request a chapter PDF, report a broken file or share feedback.",
      },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "topperdream.help@gmail.com",
    href: "mailto:topperdream.help@gmail.com",
  },
  { icon: Send, label: "Telegram", value: "@topperdream", href: "https://t.me/topperdream" },
];

function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Contact</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Need a specific chapter PDF? Found a file that won't open? Tell us and we'll fix or upload
          it — usually within a day.
        </p>

        <div className="mt-8">
          <WhatsAppButton className="w-full sm:w-auto" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="card-lift rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <c.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {c.label}
              </h2>
              <p className="mt-1 break-words text-sm font-semibold">{c.value}</p>
            </a>
          ))}
        </div>

        <div className="mt-8 rounded-2xl surface-navy p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-gold">Request a material</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy-foreground/80">
            Message us with the subject, chapter and the type of PDF you need (notes, DPP, PYQ), and
            we'll prioritise it in the next daily upload.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
