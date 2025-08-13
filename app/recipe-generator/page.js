"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  LoaderCircle,
  Salad,
  CheckCircle2,
  Bookmark,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";

const RecipeCard = ({ recipeData, onSave, isSaved }) => {
  const { content, nutrition, imageUrl } = recipeData;

  const getTitle = (markdown) => {
    if (!markdown) return "Generated Recipe";
    const titleLine = markdown
      .split("\n")
      .find((line) => line.startsWith("# "));
    return titleLine ? titleLine.replace("# ", "").trim() : "Generated Recipe";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={getTitle(content)}
          className="w-full h-64 object-cover"
        />
      )}
      <div className="p-6 sm:p-8">
        <button
          onClick={onSave}
          disabled={isSaved}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          <Bookmark className="h-4 w-4" />
          {isSaved ? "Saved!" : "Save Recipe"}
        </button>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ ...props }) => (
              <h1
                className="text-3xl font-bold tracking-tight text-slate-900 mb-4 pr-24"
                {...props}
              />
            ),
            h2: ({ ...props }) => (
              <h2
                className="text-2xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b border-slate-200"
                {...props}
              />
            ),
            li: ({ ...props }) => (
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-slate-700">{props.children}</span>
              </li>
            ),
            p: ({ ...props }) => (
              <p className="text-slate-600 leading-relaxed mb-4" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        {nutrition && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" /> Nutritional Info
            </h3>
            <div className="prose prose-sm prose-slate">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {nutrition}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function RecipeGeneratorPage() {
  const [ingredients, setIngredients] = useState("");
  const [recipeData, setRecipeData] = useState({
    content: "",
    nutrition: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("recipe_token");
    if (!token) router.push("/");
  }, [router]);

  const handleGenerateRecipe = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
    setIsLoading(true);
    setError(null);
    setRecipeData({ content: "", nutrition: "", imageUrl: "" });
    setIsSaved(false);

    try {
      const token = localStorage.getItem("recipe_token");
      const response = await fetch(
        "http://localhost:3001/api/generate-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ingredients: ingredients.split(",").map((i) => i.trim()),
          }),
        }
      );
      if (!response.ok)
        throw new Error(
          (await response.json()).error || "Failed to generate recipe."
        );
      const data = await response.json();
      setRecipeData({
        content: data.recipe,
        nutrition: data.nutrition,
        imageUrl: data.imageUrl,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipeData.content) return;
    const token = localStorage.getItem("recipe_token");
    try {
      const response = await fetch("http://localhost:3001/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: recipeData.content,
          nutrition: recipeData.nutrition,
          imageUrl: recipeData.imageUrl,
        }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).error || "Failed to save recipe."
        );
      setIsSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const RecipeSkeleton = () => (
    <div className="animate-pulse w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-slate-200 h-64 w-full"></div>
      <div className="p-8">
        <div className="h-8 bg-slate-200 rounded-md w-3/4 mb-6"></div>
        <div className="h-6 bg-slate-200 rounded-md w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded-md"></div>
          <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900">
            What's in your fridge?
          </h2>
          <p className="mt-2 text-slate-600">
            Enter your ingredients below to get started.
          </p>
          <form onSubmit={handleGenerateRecipe} className="mt-6">
            <div className="relative">
              <Salad className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., chicken breast, cherry tomatoes, garlic"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:bg-slate-400"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin h-5 w-5" />{" "}
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" /> Generate Recipe
                </>
              )}
            </button>
          </form>
        </div>
        <div className="mt-8">
          {isLoading ? (
            <RecipeSkeleton />
          ) : error ? (
            <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
              {error}
            </p>
          ) : (
            recipeData.content && (
              <RecipeCard
                recipeData={recipeData}
                onSave={handleSaveRecipe}
                isSaved={isSaved}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}
