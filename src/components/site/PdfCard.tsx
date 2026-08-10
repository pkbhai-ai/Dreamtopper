import { useState } from "react";
import { Download, Eye, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMaterialFileUrl } from "@/lib/materials.functions";
import { formatDate, type Material } from "@/lib/study";

const TYPE_TONE: Record<string, string> = {
  Notes: "bg-physics/12 text-physics",
  DPP: "bg-maths/12 text-maths",
  PYQ: "bg-chemistry/12 text-chemistry",
  Worksheet: "bg-cyan/15 text-cyan",
  "Revision Sheet": "bg-gold/20 text-gold-foreground",
  "Formula Sheet": "bg-primary/10 text-primary",
  "Mock Test": "bg-destructive/10 text-destructive",
};

export function PdfCard({ material }: { material: Material }) {
  const [busy, setBusy] = useState<"view" | "download" | null>(null);

  async function open(mode: "view" | "download") {
    setBusy(mode);
    try {
      const { url } = await getMaterialFileUrl({
        data: { id: material.id, download: mode === "download" },
      });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Sorry, this PDF could not be opened. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <article className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <FileText className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-base font-bold leading-snug">
            {material.title}
          </h3>
          <p className="mt-1 truncate text-xs font-medium text-muted-foreground">
            {material.subject} · {material.chapter}
          </p>
        </div>
      </div>

      {material.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {material.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
            TYPE_TONE[material.material_type] ?? "bg-secondary text-secondary-foreground"
          }`}
        >
          {material.material_type}
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          {formatDate(material.material_date)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 pt-1">
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => open("view")}
          disabled={busy !== null}
        >
          {busy === "view" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Eye className="size-4" />
          )}
          View
        </Button>
        <Button className="rounded-xl" onClick={() => open("download")} disabled={busy !== null}>
          {busy === "download" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Download
        </Button>
      </div>
    </article>
  );
}
