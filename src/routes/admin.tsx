import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/hooks/useAuth";
import { adminMaterialsQuery } from "@/lib/queries";
import { MATERIAL_TYPES, SUBJECTS, formatDate, todayISO } from "@/lib/study";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Topper Dream" },
      { name: "description", content: "Upload and manage Topper Dream JEE study PDFs." },
      { property: "og:title", content: "Admin Dashboard — Topper Dream" },
      { property: "og:description", content: "Upload and manage Topper Dream JEE study PDFs." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const selectClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-ring";

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const isAdmin = useIsAdmin(user?.id);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  if (loading || (user && isAdmin === null)) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <h1 className="font-display text-xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account ({user.email}) is not an admin. Ask an existing admin to grant you access.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/">Back to site</Link>
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth", replace: true });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard email={user.email ?? ""} />;
}

function Dashboard({ email }: { email: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const materials = useQuery(adminMaterialsQuery());

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [chapter, setChapter] = useState("");
  const [type, setType] = useState<string>(MATERIAL_TYPES[0]);
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Please choose a PDF file.");
      if (file.type !== "application/pdf") throw new Error("Only PDF files are allowed.");
      if (file.size > 25 * 1024 * 1024) throw new Error("File must be under 25 MB.");

      const path = `${subject.toLowerCase()}/${Date.now()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
      const { error: uploadError } = await supabase.storage
        .from("materials")
        .upload(path, file, { contentType: "application/pdf" });
      if (uploadError) throw uploadError;

      const { error } = await supabase.from("materials").insert({
        title: title.trim(),
        subject,
        chapter: chapter.trim(),
        material_type: type,
        material_date: date,
        description: description.trim() || null,
        file_path: path,
        published: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("PDF uploaded and published.");
      setTitle("");
      setChapter("");
      setDescription("");
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Upload failed."),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("materials").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
    onError: () => toast.error("Could not update this material."),
  });

  const remove = useMutation({
    mutationFn: async ({ id, path }: { id: string; path: string }) => {
      await supabase.storage.from("materials").remove([path]);
      const { error } = await supabase.from("materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Material deleted.");
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: () => toast.error("Could not delete this material."),
  });

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-extrabold">Admin Dashboard</h1>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link to="/">View site</Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-lg"
              onClick={async () => {
                await queryClient.cancelQueries();
                queryClient.clear();
                await supabase.auth.signOut();
                navigate({ to: "/auth", replace: true });
              }}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <h2 className="font-display text-lg font-bold">Upload new PDF</h2>
          <form
            className="mt-5 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              upload.mutate();
            }}
          >
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                maxLength={140}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11 rounded-xl"
                placeholder="Rotational Motion — DPP 04"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <select
                id="subject"
                className={selectClass}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="chapter">Chapter</Label>
              <Input
                id="chapter"
                required
                maxLength={100}
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="h-11 rounded-xl"
                placeholder="Rotational Motion"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type">Material type</Label>
              <select
                id="type"
                className={selectClass}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {MATERIAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <input
                id="date"
                type="date"
                className={selectClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                maxLength={400}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl"
                placeholder="20 questions covering torque and moment of inertia."
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="file">PDF file</Label>
              <Input
                id="file"
                type="file"
                accept="application/pdf"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="h-11 rounded-xl pt-2.5"
              />
            </div>

            <Button
              type="submit"
              className="h-11 rounded-xl sm:col-span-2"
              disabled={upload.isPending}
            >
              {upload.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Upload & publish
            </Button>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-lg font-bold">
            All materials {materials.data ? `(${materials.data.length})` : ""}
          </h2>

          <div className="mt-4 space-y-3">
            {materials.isLoading &&
              [0, 1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl border border-border bg-card" />
              ))}

            {materials.data?.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{m.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {m.subject} · {m.chapter} · {m.material_type} · {formatDate(m.material_date)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    size="sm"
                    variant={m.published ? "secondary" : "outline"}
                    className="rounded-lg"
                    onClick={() => togglePublish.mutate({ id: m.id, published: !m.published })}
                  >
                    {m.published ? "Published" : "Draft"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm(`Delete "${m.title}"? This cannot be undone.`)) {
                        remove.mutate({ id: m.id, path: m.file_path });
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}

            {!materials.isLoading && materials.data?.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                Nothing uploaded yet. Add your first PDF above.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
