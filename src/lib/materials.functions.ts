import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
  download: z.boolean().optional(),
});

/**
 * Public: returns a short-lived signed URL for a PUBLISHED material only.
 * Unpublished drafts are never exposed here.
 */
export const getMaterialFileUrl = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: material, error } = await supabaseAdmin
      .from("materials")
      .select("file_path, published, title")
      .eq("id", data.id)
      .maybeSingle();

    if (error) throw new Error("Could not load this material right now.");
    if (!material || !material.published) throw new Error("This material is not available.");

    const safeName = material.title.replace(/[^a-z0-9\-_ ]/gi, "").trim() || "topper-dream";

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("materials")
      .createSignedUrl(
        material.file_path,
        600,
        data.download ? { download: `${safeName}.pdf` } : undefined,
      );

    if (signError || !signed) throw new Error("Could not prepare the file link.");
    return { url: signed.signedUrl };
  });
