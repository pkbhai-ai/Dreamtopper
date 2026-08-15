import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/daily", label: "Daily PDFs" },
  { to: "/subjects", label: "Subjects" },
  { to: "/announcements", label: "Announcements" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl surface-navy shadow-soft">
            <GraduationCap className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-bold leading-tight">
              Topper Dream
            </span>
            <span className="block truncate text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              JEE Study Hub
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <WhatsAppButton className="mr-1 px-3 py-2 text-xs" label="WhatsApp" />
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2 rounded-lg">
            <Link to="/admin">Admin</Link>
          </Button>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 pb-4 pt-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
          <WhatsAppButton className="mt-2 w-full" />
          <Button asChild className="mt-2 w-full rounded-lg">
            <Link to="/admin" onClick={() => setOpen(false)}>
              Admin Login
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
