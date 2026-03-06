import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { endpoints } from '../services/api';
import type { PhraseCategory, Phrase } from '../types';
import { useKeyboardNav } from '../hooks/useKeyboardNav';

function PracticeDashboard() {
  const navigate = useNavigate();
  useKeyboardNav();
  const [categories, setCategories] = useState<PhraseCategory[]>([]);
  const [phrasesByCategory, setPhrasesByCategory] = useState<Record<number, Phrase[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catsRes = await fetch(endpoints.phraseCategories.getAll());
        const catsData = await catsRes.json();
        setCategories(catsData);

        const phrasesRes = await fetch(endpoints.phrases.getAll());
        const phrasesData = await phrasesRes.json();

        const grouped: Record<number, Phrase[]> = {};
        phrasesData.forEach((phrase: Phrase) => {
          if (!grouped[phrase.categoryId]) {
            grouped[phrase.categoryId] = [];
          }
          grouped[phrase.categoryId].push(phrase);
        });
        setPhrasesByCategory(grouped);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCompletedCount = (categoryId: number) => {
    const phrases = phrasesByCategory[categoryId] || [];
    return phrases.filter(p => p.timesCompleted > 0).length;
  };

  const getTotalCount = (categoryId: number) => {
    return (phrasesByCategory[categoryId] || []).length;
  };

  const getProgress = (categoryId: number) => {
    const total = getTotalCount(categoryId);
    if (total === 0) return 0;
    return (getCompletedCount(categoryId) / total) * 100;
  };

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'daily':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'outdoor':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'work':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <Layout showBreadcrumbs>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBreadcrumbs>
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Practice Phrases
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Select a category to start practicing your English pronunciation
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {categories.map((category) => {
          const completed = getCompletedCount(category.id);
          const total = getTotalCount(category.id);
          const progress = getProgress(category.id);

          return (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/practice/${category.name}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-600 text-white rounded-lg">
                  {getCategoryIcon(category.name)}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {completed}/{total} completed
                </span>
              </div>

              <h2 className="text-xl font-semibold mb-2 dark:text-white capitalize">
                {category.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {category.description}
              </p>

              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                Start Practice
              </button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export default PracticeDashboard;
