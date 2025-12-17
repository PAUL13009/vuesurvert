import { supabaseAnon } from "@/lib/supabase/anon";
import FadeInSection from "@/components/FadeInSection";
import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
};

export default async function BlogPage() {
  const supabase = supabaseAnon();
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  // Formater les articles depuis Supabase
  const blogPosts: BlogPost[] = (articles || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    date: new Date(article.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    category: article.category,
  }));

  // Si pas d'articles, afficher un message
  if (blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-medium tracking-tight text-zinc-900 mb-4">Actualités</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-8">
              Découvrez nos articles sur l'immobilier écologique, les tendances durables et les innovations qui transforment le secteur immobilier.
            </p>
            <p className="text-zinc-500">Aucun article pour le moment.</p>
          </div>
        </section>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-16">
            <h1 className="text-2xl font-medium tracking-tight text-zinc-900 mb-4">Actualités</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Découvrez nos articles sur l'immobilier écologique, les tendances durables et les innovations qui transforment le secteur immobilier.
            </p>
          </div>
        </FadeInSection>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogPosts.map((post, index) => (
            <FadeInSection key={post.id} delay={index * 100}>
              <article className="flex flex-col h-full border border-zinc-200 rounded-lg bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300" style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.06)' }}>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-zinc-600 bg-zinc-100 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 mb-3 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-zinc-700 text-sm leading-relaxed mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
                    <span className="text-xs text-zinc-500">{post.date}</span>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="text-sm font-medium transition-colors"
                      style={{ color: "#00E09E" }}
                    >
                      Lire la suite →
                    </Link>
                  </div>
                </div>
              </article>
            </FadeInSection>
          ))}
        </div>
      </section>
    </div>
  );
}

