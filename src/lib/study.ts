export const SUBJECTS = ["Physics", "Chemistry", "Mathematics", "PYQ"] as const;
export type Subject = (typeof SUBJECTS)[number];

export const MATERIAL_TYPES = [
  "Notes",
  "DPP",
  "PYQ",
  "Worksheet",
  "Revision Sheet",
  "Formula Sheet",
  "Mock Test",
] as const;
export type MaterialType = (typeof MATERIAL_TYPES)[number];

export const SUBJECT_META: Record<
  string,
  { slug: string; blurb: string; accent: string; dot: string }
> = {
  Physics: {
    slug: "physics",
    blurb: "Mechanics, Electrodynamics, Modern Physics — concept notes and daily practice.",
    accent: "text-physics",
    dot: "bg-physics",
  },
  Chemistry: {
    slug: "chemistry",
    blurb: "Physical, Organic and Inorganic — reaction sheets, short notes and PYQs.",
    accent: "text-chemistry",
    dot: "bg-chemistry",
  },
  Mathematics: {
    slug: "mathematics",
    blurb: "Calculus, Algebra, Coordinate Geometry — solved sets and formula sheets.",
    accent: "text-maths",
    dot: "bg-maths",
  },
  PYQ: {
    slug: "pyq",
    blurb: "Previous year questions — JEE Main and Advanced papers with solutions.",
    accent: "text-pyq",
    dot: "bg-pyq",
  },
};

export function subjectFromSlug(slug: string): string | undefined {
  return SUBJECTS.find((s) => SUBJECT_META[s]!.slug === slug.toLowerCase());
}

export function formatDate(value: string): string {
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function todayISO(): string {
  const now = new Date();
  const offsetMs = now.getTime() - now.getTimezoneOffset() * 60000;
  return new Date(offsetMs).toISOString().slice(0, 10);
}

export type Material = {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  material_type: string;
  description: string | null;
  material_date: string;
  file_path: string;
  published: boolean;
  created_at: string;
};
