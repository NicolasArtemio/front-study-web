import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { endpoints } from '../services/api';
import type { Phrase, PhraseCategory } from '../types';
import { Home } from 'lucide-react';
import { useKeyboardNav } from '../hooks/useKeyboardNav';

function PhraseList() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  useKeyboardNav();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [categoryData, setCategoryData] = useState<PhraseCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catsRes = await fetch(endpoints.phraseCategories.getAll());
        const catsData: PhraseCategory[] = await catsRes.json();
        const cat = catsData.find(c => c.name === category);
        if (cat) {
          setCategoryData(cat);
          const phrasesRes = await fetch(endpoints.phrases.getAll(cat.id));
          const phrasesData: Phrase[] = await phrasesRes.json();
          setPhrases(phrasesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const subcategories = [...new Set(phrases.map(p => p.subcategory).filter(Boolean))];

  const filteredPhrases = filterSubcategory === 'all'
    ? phrases
    : phrases.filter(p => p.subcategory === filterSubcategory);

  const isPracticedToday = (phrase: Phrase) => {
    if (!phrase.lastPracticed) return false;
    const today = new Date().toDateString();
    return new Date(phrase.lastPracticed).toDateString() === today;
  };

  const getStatusIcons = (phrase: Phrase) => {
    const icons = [];
    if (isPracticedToday(phrase)) {
      icons.push('✅');
    }
    if (phrase.timesCompleted >= 5) {
      icons.push('⭐');
    } else if (phrase.timesCompleted > 0) {
      icons.push('🔥');
    }
    return icons;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-between mb-4">
        <BackButton to="/practice" label="Back to Practice" />
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-2 dark:text-white capitalize">
        {category} Phrases
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {categoryData?.description}
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterSubcategory('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${filterSubcategory === 'all'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          All
        </button>
        {subcategories.map(sub => (
          <button
            key={sub}
            onClick={() => setFilterSubcategory(sub || 'all')}
            className={`px-4 py-2 rounded-lg transition-colors capitalize ${filterSubcategory === sub
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPhrases.map((phrase) => (
          <div
            key={phrase.id}
            onClick={() => navigate(`/practice/${category}/${phrase.id}`)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {phrase.isQuestion && (
                    <span className="text-purple-600 font-medium">Q:</span>
                  )}
                  <span className="dark:text-white">{phrase.english}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {phrase.spanish}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs capitalize ${getDifficultyColor(phrase.difficulty)}`}>
                  {phrase.difficulty}
                </span>
                <span className="text-lg">{getStatusIcons(phrase).join(' ')}</span>
              </div>
            </div>
            {phrase.subcategory && (
              <div className="mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-500 uppercase">
                  {phrase.subcategory}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPhrases.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No phrases found for this filter.
        </p>
      )}
    </Layout>
  );
}

export default PhraseList;
