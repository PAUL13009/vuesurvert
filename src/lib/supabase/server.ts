import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  let cookieStore: Awaited<ReturnType<typeof cookies>>;
  try {
    cookieStore = await cookies();
  } catch {
    // Fallback if cookies() is not available (e.g., in some server action contexts)
    // Return a client that won't work for auth but can be used for public queries
    return createServerClient(url, anon, {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    });
  }

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        try {
          return cookieStore.get(name)?.value;
        } catch {
          return undefined;
        }
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // no-op
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // no-op
        }
      },
    },
  });
}


