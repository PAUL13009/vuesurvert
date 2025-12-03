"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import PropertyForm from "./PropertyForm";
import PropertyList from "./PropertyList";
import ArticleForm, { type Article } from "./ArticleForm";
import ArticleList from "./ArticleList";
import CollaboratorForm, { type Collaborator } from "./CollaboratorForm";
import CollaboratorList from "./CollaboratorList";
import LogoUpload from "./LogoUpload";
import type { Property } from "@/components/PropertyCard";
import { deleteProperty } from "./actions";

type TabType = "annonces" | "articles" | "collaborateurs" | "trafic" | "logo";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("annonces");
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour les articles
  const [articles, setArticles] = useState<Article[]>([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  
  // États pour les collaborateurs
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showCollaboratorForm, setShowCollaboratorForm] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/admin");
      } else {
        setReady(true);
        fetchProperties();
        fetchArticles();
        fetchCollaborators();
      }
    });
  }, [supabase, router]);

  async function fetchProperties() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching properties:", error.message || error);
        if (error.message?.includes("Could not find the table")) {
          console.error("⚠️ La table 'properties' n'existe pas encore dans Supabase. Exécutez le SQL dans supabase-setup.sql");
        }
        setProperties([]);
      } else {
        setProperties((data as Property[]) || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching properties:", err);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddClick() {
    setEditingProperty(null);
    setShowForm(true);
  }

  function handleEditClick(property: Property) {
    setEditingProperty(property);
    setShowForm(true);
  }

  async function handleDeleteClick(id: string) {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      return;
    }

    try {
      const result = await deleteProperty(id);

      if (!result.success) {
        alert(result.error || "Erreur lors de la suppression");
        return;
      }

      // Revalider le cache et mettre à jour l'interface
      router.refresh();
      await fetchProperties();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingProperty(null);
    fetchProperties();
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditingProperty(null);
  }

  // Fonctions pour les articles
  async function fetchArticles() {
    setIsLoadingArticles(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching articles:", error.message || error);
        setArticles([]);
      } else {
        setArticles((data as Article[]) || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching articles:", err);
      setArticles([]);
    } finally {
      setIsLoadingArticles(false);
    }
  }

  function handleAddArticleClick() {
    setEditingArticle(null);
    setShowArticleForm(true);
  }

  function handleEditArticleClick(article: Article) {
    setEditingArticle(article);
    setShowArticleForm(true);
  }

  async function handleDeleteArticleClick(id: string) {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Non authentifié. Veuillez vous reconnecter.");
      return;
    }

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      router.refresh();
      await fetchArticles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  }

  function handleArticleFormSuccess() {
    setShowArticleForm(false);
    setEditingArticle(null);
    fetchArticles();
    router.refresh();
  }

  function handleArticleFormCancel() {
    setShowArticleForm(false);
    setEditingArticle(null);
  }

  // Fonctions pour les collaborateurs
  async function fetchCollaborators() {
    setIsLoadingCollaborators(true);
    try {
      const { data, error } = await supabase
        .from("collaborators")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching collaborators:", error.message || error);
        setCollaborators([]);
      } else {
        setCollaborators((data as Collaborator[]) || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching collaborators:", err);
      setCollaborators([]);
    } finally {
      setIsLoadingCollaborators(false);
    }
  }

  function handleAddCollaboratorClick() {
    setEditingCollaborator(null);
    setShowCollaboratorForm(true);
  }

  function handleEditCollaboratorClick(collaborator: Collaborator) {
    setEditingCollaborator(collaborator);
    setShowCollaboratorForm(true);
  }

  async function handleDeleteCollaboratorClick(id: string) {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce collaborateur ?")) {
      return;
    }

    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Non authentifié. Veuillez vous reconnecter.");
      return;
    }

    try {
      const { error } = await supabase
        .from("collaborators")
        .delete()
        .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      router.refresh();
      await fetchCollaborators();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  }

  function handleCollaboratorFormSuccess() {
    setShowCollaboratorForm(false);
    setEditingCollaborator(null);
    fetchCollaborators();
    router.refresh();
  }

  function handleCollaboratorFormCancel() {
    setShowCollaboratorForm(false);
    setEditingCollaborator(null);
  }

  if (!ready) {
    return null;
  }

  const tabs = [
    { id: "annonces" as TabType, label: "Gestion des annonces" },
    { id: "articles" as TabType, label: "Ajout d'articles" },
    { id: "collaborateurs" as TabType, label: "Ajout de collaborateur" },
    { id: "trafic" as TabType, label: "Visibilité et Trafic" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">Gérez votre contenu</p>
      </div>

      {/* Navigation des onglets */}
      <div className="mb-6 border-b border-zinc-200">
        <nav className="flex gap-2" aria-label="Onglets du dashboard">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowForm(false);
                setEditingProperty(null);
                setShowArticleForm(false);
                setEditingArticle(null);
                setShowCollaboratorForm(false);
                setEditingCollaborator(null);
              }}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div>
        {activeTab === "annonces" && (
          <div>
            {!showForm && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleAddClick}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  Ajouter une annonce
                </button>
              </div>
            )}

            {showForm ? (
              <div className="mb-6">
                <PropertyForm
                  property={editingProperty}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </div>
            ) : (
              <>
                {isLoading ? (
                  <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
                    <p className="text-zinc-600">Chargement…</p>
                  </div>
                ) : (
                  <PropertyList
                    properties={properties}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "articles" && (
          <div>
            {!showArticleForm && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleAddArticleClick}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  Ajouter un article
                </button>
              </div>
            )}

            {showArticleForm ? (
              <div className="mb-6">
                <ArticleForm
                  article={editingArticle}
                  onSuccess={handleArticleFormSuccess}
                  onCancel={handleArticleFormCancel}
                />
              </div>
            ) : (
              <>
                {isLoadingArticles ? (
                  <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
                    <p className="text-zinc-600">Chargement…</p>
                  </div>
                ) : (
                  <ArticleList
                    articles={articles}
                    onEdit={handleEditArticleClick}
                    onDelete={handleDeleteArticleClick}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "collaborateurs" && (
          <div>
            {!showCollaboratorForm && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleAddCollaboratorClick}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  Ajouter un collaborateur
                </button>
              </div>
            )}

            {showCollaboratorForm ? (
              <div className="mb-6">
                <CollaboratorForm
                  collaborator={editingCollaborator}
                  onSuccess={handleCollaboratorFormSuccess}
                  onCancel={handleCollaboratorFormCancel}
                />
              </div>
            ) : (
              <>
                {isLoadingCollaborators ? (
                  <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
                    <p className="text-zinc-600">Chargement…</p>
                  </div>
                ) : (
                  <CollaboratorList
                    collaborators={collaborators}
                    onEdit={handleEditCollaboratorClick}
                    onDelete={handleDeleteCollaboratorClick}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "logo" && (
          <LogoUpload />
        )}

        {activeTab === "trafic" && (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
            <p className="text-zinc-600">Section à venir</p>
          </div>
        )}
      </div>
    </div>
  );
}
