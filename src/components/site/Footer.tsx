import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { CREDITS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 surface-navy">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-foreground/10">
                <GraduationCap className="size-5" />
              </span>
              <span className="font-display text-lg font-bold">Topper Dream</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-foreground/70">
              Daily JEE study materials, notes, PYQs and practice PDFs — organised subject-wise so
              you spend time studying, not searching.
            </p>
            <WhatsAppButton className="mt-5 w-full sm:w-auto" />
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-gold">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/75">
              <li>
                <Link to="/daily" className="hover:text-navy-foreground">
                  Daily PDFs
                </Link>
              </li>
              <li>
                <Link to="/subjects" className="hover:text-navy-foreground">
                  Subjects
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-navy-foreground">
                  Announcements
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-gold">More</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/75">
              <li>
                <Link to="/about" className="hover:text-navy-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-navy-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-navy-foreground">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-foreground/15 pt-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Credits</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            {CREDITS.map((c) => (
              <div
                key={c.role}
                className="min-w-0 rounded-xl border border-navy-foreground/15 bg-navy-foreground/5 px-4 py-3"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-navy-foreground/60">
                  {c.role}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-semibold text-navy-foreground">
                  {c.name}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 border-t border-navy-foreground/15 pt-6 text-sm text-navy-foreground/70">
          <p>© {new Date().getFullYear()} Topper Dream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
