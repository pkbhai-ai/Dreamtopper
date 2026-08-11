import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "../components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Topper Dream — Daily JEE Study Material PDFs" },
      {
        name: "description",
        content:
          "Daily JEE notes, DPPs, PYQs and practice PDFs for Physics, Chemistry and Mathematics.",
      },
      { name: "author", content: "Ghanshyam Roy" },
      { property: "og:title", content: "Topper Dream — Daily JEE Study Material PDFs" },
      {
        property: "og:description",
        content: "Daily JEE notes, DPPs, PYQs and practice PDFs, organised subject-wise.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Handle OAuth / redirect-based auth flows that return tokens in the URL.
  // Supabase and some OAuth providers return tokens or codes in the URL after redirect.
  // Ensure we parse and store the session so the app recognises the logged-in user.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldProcess = window.location.hash.includes("access_token=") || window.location.search.includes("code=");
    if (!shouldProcess) return;

    (async () => {
      try {
        // supabase-js v2 exposes getSessionFromUrl which parses the redirect URL and stores the session.
        // Use optional chaining to avoid runtime errors if the method is not present.
        const authAny = (supabase.auth as any);
        if (typeof authAny.getSessionFromUrl === "function") {
          await authAny.getSessionFromUrl({ storeSession: true });
        } else if (typeof authAny.getSession === "function") {
          // Fallback: some integrations will have already set the session, so attempt to read it.
          await authAny.getSession();
        }
      } catch (e) {
        // ignore: session parsing is best-effort
        // console.error('Error processing auth redirect:', e);
      } finally {
        // Clean the URL to remove tokens or codes so the app routes normally.
        try {
          const clean = window.location.pathname + window.location.search;
          window.history.replaceState({}, document.title, clean);
        } catch (e) {
          // ignore
        }
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
