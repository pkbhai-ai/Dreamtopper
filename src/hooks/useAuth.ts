import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (!active) return;
      // INITIAL_SESSION can fire with null before the persisted session is
      // restored from storage; only trust it once loading has resolved.
      setSession(s);
      if (event !== "INITIAL_SESSION" || s) setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export function useIsAdmin(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsAdmin(null);
      return;
    }
    setIsAdmin(null);
    supabase
      .rpc("has_role", { _user_id: userId, _role: "admin" })
      .then(({ data, error }) => {
        if (!active) return;
        setIsAdmin(error ? false : Boolean(data));
      });
    return () => {
      active = false;
    };
  }, [userId]);

  return isAdmin;
}
