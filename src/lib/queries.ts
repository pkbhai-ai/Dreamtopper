import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Material } from "./study";

export type MaterialFilters = {
  search?: string;
  subject?: string;
  chapter?: string;
  date?: string;
  type?: string;
  limit?: number;
};

const SELECT =
  "id, title, subject, chapter, material_type, description, material_date, file_path, published, created_at";

export async function fetchPublicMaterials(filters: MaterialFilters = {}): Promise<Material[]> {
  let query = supabase
    .from("materials")
    .select(SELECT)
    .eq("published", true)
    .order("material_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.search) query = query.ilike("title", `%${filters.search}%`);
  if (filters.subject) query = query.eq("subject", filters.subject);
  if (filters.chapter) query = query.ilike("chapter", `%${filters.chapter}%`);
  if (filters.date) query = query.eq("material_date", filters.date);
  if (filters.type) query = query.eq("material_type", filters.type);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Material[];
}

export const publicMaterialsQuery = (filters: MaterialFilters = {}) =>
  queryOptions({
    queryKey: ["materials", "public", filters],
    queryFn: () => fetchPublicMaterials(filters),
  });

export const statsQuery = (today: string) =>
  queryOptions({
    queryKey: ["materials", "stats", today],
    queryFn: async () => {
      const [total, todayCount, subjects] = await Promise.all([
        supabase.from("materials").select("id", { count: "exact", head: true }).eq("published", true),
        supabase
          .from("materials")
          .select("id", { count: "exact", head: true })
          .eq("published", true)
          .eq("material_date", today),
        supabase.from("materials").select("subject").eq("published", true),
      ]);

      const uniqueSubjects = new Set((subjects.data ?? []).map((r) => r.subject));
      return {
        total: total.count ?? 0,
        today: todayCount.count ?? 0,
        subjects: uniqueSubjects.size,
      };
    },
  });

export const announcementsQuery = () =>
  queryOptions({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("id, title, body, pinned, created_at")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const adminMaterialsQuery = () =>
  queryOptions({
    queryKey: ["materials", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select(SELECT)
        .order("material_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Material[];
    },
  });
