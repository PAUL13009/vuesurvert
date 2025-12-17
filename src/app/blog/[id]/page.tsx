import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAnon } from "@/lib/supabase/anon";
import FadeInSection from "@/components/FadeInSection";
import LinkedInShareButton from "./LinkedInShareButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = supabaseAnon();
  
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  // Formater la date
  const formattedDate = new Date(article.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // URL de partage LinkedIn (utiliser l'URL complète du site)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vuesurvert.fr";
  const articleUrl = `${baseUrl}/blog/${id}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center text-sm transition-colors"
          style={{ color: "#00E09E" }}
        >
          ← Retour aux articles
        </Link>

        <FadeInSection>
          <article>
            {/* En-tête */}
            <div className="mb-8">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium text-zinc-600 bg-zinc-100 rounded-full">
                  {article.category}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-zinc-900 mb-4">{article.title}</h1>
              <p className="text-sm text-zinc-500">{formattedDate}</p>
            </div>

            {/* Contenu */}
            <div className="mb-12">
              <div 
                className="text-zinc-700 leading-relaxed text-base space-y-4"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {article.content.split('\n').map((paragraph: string, index: number) => (
                  paragraph.trim() ? (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ) : (
                    <br key={index} />
                  )
                ))}
              </div>
            </div>

            {/* CTA LinkedIn */}
            <div className="mt-16 pt-8 border-t border-zinc-200">
              <div className="bg-zinc-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  Partagez cet article
                </h3>
                <p className="text-sm text-zinc-600 mb-4">
                  Aidez-nous à diffuser nos contenus sur l'immobilier écologique
                </p>
                <LinkedInShareButton url={linkedInShareUrl} />
              </div>
            </div>
          </article>
        </FadeInSection>
      </div>
    </div>
  );
}

