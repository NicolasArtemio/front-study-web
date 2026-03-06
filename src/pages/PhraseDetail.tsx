import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import VoiceRecorder from '../components/VoiceRecorder';
import { endpoints } from '../services/api';
import type { Phrase, PracticeSession } from '../types';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { useKeyboardNav } from '../hooks/useKeyboardNav';

function PhraseDetail() {
  const { category, phraseId } = useParams<{ category: string; phraseId: string }>();
  const navigate = useNavigate();
  useKeyboardNav();
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [allPhrases, setAllPhrases] = useState<Phrase[]>([]);
  const [relatedPhrase, setRelatedPhrase] = useState<Phrase | null>(null);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const phraseRes = await fetch(endpoints.phrases.getById(phraseId!));
        const phraseData: Phrase = await phraseRes.json();
        setPhrase(phraseData);

        const catsRes = await fetch(endpoints.phraseCategories.getAll());
        const catsData = await catsRes.json();
        const cat = catsData.find((c: any) => c.name === category);

        if (cat) {
          const allPhrasesRes = await fetch(endpoints.phrases.getAll(cat.id));
          const allPhrasesData: Phrase[] = await allPhrasesRes.json();
          setAllPhrases(allPhrasesData);
        }

        if (phraseData.relatedPhraseId) {
          const relatedRes = await fetch(endpoints.phrases.getById(phraseData.relatedPhraseId));
          const relatedData: Phrase = await relatedRes.json();
          setRelatedPhrase(relatedData);
        }

        const sessionsRes = await fetch(endpoints.phrases.getSessions(phraseId!));
        const sessionsData: PracticeSession[] = await sessionsRes.json();
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [phraseId, category]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRecordingComplete = (base64: string) => {
    if (!phrase) return;

    fetch('data:application/json;base64,' + btoa(JSON.stringify({ base64 }))).then(() => {
      fetch(endpoints.practiceSessions.create(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phraseId: phrase.id,
          recordingBlob: base64,
          duration: 0,
        }),
      }).then(async () => {
        await fetch(endpoints.phrases.complete(phrase.id), { method: 'PATCH' });

        const sessionsRes = await fetch(endpoints.phrases.getSessions(phrase.id));
        const sessionsData: PracticeSession[] = await sessionsRes.json();
        setSessions(sessionsData);

        const phraseRes = await fetch(endpoints.phrases.getById(phrase.id));
        const phraseData: Phrase = await phraseRes.json();
        setPhrase(phraseData);
      });
    });
  };

  const playRecording = (blob: string) => {
    const audio = new Audio(blob);
    audio.play();
  };

  const currentIndex = allPhrases.findIndex(p => p.id === Number(phraseId));
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPhrases.length - 1;

  const goToPrev = () => {
    if (hasPrev) {
      navigate(`/practice/${category}/${allPhrases[currentIndex - 1].id}`);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      navigate(`/practice/${category}/${allPhrases[currentIndex + 1].id}`);
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

  if (!phrase) {
    return (
      <Layout showBreadcrumbs>
        <div className="text-center py-8">
          <p className="text-gray-500">Phrase not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBreadcrumbs>
      <div className="flex items-center justify-between mb-4">
        <BackButton to={`/practice/${category}`} label="Back to List" />
        <button
          onClick={() => navigate(`/practice/${category}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <List className="w-4 h-4" />
          List
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-purple-600 text-white rounded-full text-sm mb-4">
            {phrase.subcategory || category}
          </span>
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            {phrase.english}
          </h1>
          <button
            onClick={() => speakText(phrase.english)}
            className="flex items-center justify-center mx-auto gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Play Original
          </button>

          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="text-cyan-600 dark:text-cyan-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm underline"
          >
            {showTranslation ? 'Hide Translation' : 'Show Translation'}
          </button>
          {showTranslation && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
              {phrase.spanish}
            </p>
          )}
        </div>

        {phrase.pronunciation && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Pronunciation: <span className="italic">{phrase.pronunciation}</span>
            </p>
          </div>
        )}

        <div className="flex justify-center gap-4 mb-4">
          <span className={`px-3 py-1 rounded text-sm capitalize ${phrase.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            phrase.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
            {phrase.difficulty}
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-sm">
            Practiced: {phrase.timesCompleted} times
          </span>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${hasPrev
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="flex items-center px-4 py-2 text-gray-500">
            {currentIndex + 1} / {allPhrases.length}
          </span>
          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${hasNext
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {relatedPhrase && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Related response:</p>
          <p className="dark:text-white">{relatedPhrase.english}</p>
          <button
            onClick={() => speakText(relatedPhrase.english)}
            className="mt-2 flex items-center gap-1 text-green-600 dark:text-green-400 text-sm hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Listen
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Record Your Voice</h2>

        <VoiceRecorder onSave={handleRecordingComplete} />
      </div>

      {sessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Recordings</h2>
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(session.createdAt).toLocaleString()}
                </span>
                {session.recordingBlob && (
                  <button
                    onClick={() => playRecording(session.recordingBlob!)}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Play
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PhraseDetail;
