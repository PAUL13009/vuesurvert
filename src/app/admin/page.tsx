"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSessionEmail(data.user?.email ?? null);
      if (data.user?.email) {
        router.push("/admin/dashboard");
      }
    });
  }, [supabase, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    const { data } = await supabase.auth.getUser();
    setSessionEmail(data.user?.email ?? null);
    setMessage("Connexion réussie.");
  }

  async function onSignOut() {
    await supabase.auth.signOut();
    setSessionEmail(null);
    setMessage("Déconnexion réussie.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">Espace administrateur</h1>
        {sessionEmail ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-zinc-700">Connecté en tant que: {sessionEmail}</p>
            <button
              onClick={onSignOut}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Se déconnecter
            </button>
            {message ? <p className="text-center text-sm text-zinc-600">{message}</p> : null}
            <div className="mt-6 text-center text-sm">
              <Link href="/" className="text-emerald-700 hover:underline">← Retour à l’accueil</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm text-zinc-600">Connectez-vous pour accéder à l’administration.</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4" aria-label="Formulaire d’authentification">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-800">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
                  placeholder="vous@exemple.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-800">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {isSubmitting ? "Connexion…" : "Se connecter"}
              </button>
              {message ? <p className="text-center text-sm text-zinc-600">{message}</p> : null}
            </form>
            <div className="mt-6 text-center text-sm">
              <Link href="/" className="text-emerald-700 hover:underline">← Retour à l’accueil</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


