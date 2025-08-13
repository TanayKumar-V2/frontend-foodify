'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CheckCircle2, LoaderCircle, Inbox, ChevronDown, Zap, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const SavedRecipeCard = ({ recipe, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getTitle = (markdown) => {
    if (!markdown) return "Untitled Recipe";
    const titleLine = markdown.split('\n').find(line => line.startsWith('# '));
    return titleLine ? titleLine.replace('# ', '').trim() : "Untitled Recipe";
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      onDelete(recipe._id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={getTitle(recipe.content)} className="w-full h-48 object-cover" />
      )}
      <div
        className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold text-slate-800 pr-4">{getTitle(recipe.content)}</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDeleteClick}
            className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 transition-colors"
            aria-label="Delete recipe"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <ChevronDown
            className={`h-6 w-6 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="px-6 pb-8 border-t border-slate-200">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            h1: ({...props}) => <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4" {...props} />,
            h2: ({...props}) => <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b border-slate-200" {...props} />,
            li: ({...props}) => <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" /><span className="text-slate-700">{props.children}</span></li>,
            p: ({...props}) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
          }}>
            {recipe.content}
          </ReactMarkdown>
          {recipe.nutrition && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2"><Zap className="h-5 w-5 text-amber-500" /> Nutritional Info</h3>
              <div className="prose prose-sm prose-slate">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{recipe.nutrition}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('recipe_token');
    if (!token) {
      router.push('/');
      return;
    }
    try {
      const response = await fetch('https://foodify-backend-1qug.onrender.com/api/recipes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch recipes.');
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleDeleteRecipe = async (id) => {
    const token = localStorage.getItem('recipe_token');
    try {
      const response = await fetch(`https://foodify-backend-1qug.onrender.com/api/recipes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete recipe.');
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Saved Recipes</h1>
        {isLoading ? (
          <div className="text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-emerald-500" /></div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : recipes.length > 0 ? (
          <div className="space-y-4">
            {recipes.map(recipe => <SavedRecipeCard key={recipe._id} recipe={recipe} onDelete={handleDeleteRecipe} />)}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <Inbox className="mx-auto h-12 w-12 text-slate-400" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">No recipes saved yet.</h2>
            <p className="mt-2 text-slate-500">Generate a recipe to save it for later!</p>
          </div>
        )}
      </main>
    </div>
  );
}
