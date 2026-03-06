import { useState, type ChangeEvent, type FormEvent } from "react";
import useFetch from "../hooks/useFetch";
import usePost from "../hooks/usePost";
import useUpdate from "../hooks/useUpdate";
import useDelete from "../hooks/useDelete";
import { endpoints } from "../services/api";
import VoiceRecorder from "../components/VoiceRecorder";
import AudioPlayer from "../components/AudioPlayer";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import type { Vocabulary, CreateVocabularyDTO } from "../types";

const CATEGORIES = [
  { value: "grammar", label: "Grammar" },
  { value: "listening", label: "Listening" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "speaking", label: "Speaking" },
  { value: "writing", label: "Writing" },
  { value: "pronunciation", label: "Pronunciation" },
  { value: "phrasal-verbs", label: "Phrasal Verbs" },
  { value: "reading", label: "Reading" },
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

interface FormData {
  word: string;
  meaning: string;
  example: string;
  category: string;
  difficulty: string;
  audioRecording: string;
}

const initialFormData: FormData = {
  word: "",
  meaning: "",
  example: "",
  category: "",
  difficulty: "",
  audioRecording: "",
};

const VocabularyPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: vocabulary, loading, error: fetchError, refetch } = useFetch<Vocabulary[]>("vocabulary");
  const { post, loading: posting } = usePost<Vocabulary>();
  const { update, loading: updating } = useUpdate<Vocabulary>();
  const { remove, loading: deleting } = useDelete();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAudioSave = (base64: string) => {
    setFormData((prev) => ({ ...prev, audioRecording: base64 }));
    setMessage("Audio guardado");
    setTimeout(() => setMessage(""), 2000);
  };

  const validateForm = (): boolean => {
    if (!formData.word.trim()) {
      setError("La palabra es obligatoria");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: CreateVocabularyDTO = {
      word: formData.word,
      meaning: formData.meaning || undefined,
      example: formData.example || undefined,
      category: formData.category || undefined,
      difficulty: (formData.difficulty as "easy" | "medium" | "hard") || undefined,
      audioRecording: formData.audioRecording || undefined,
    };

    try {
      if (editingId) {
        await update(endpoints.vocabulary.update(editingId), payload);
        setMessage("Vocabulario actualizado");
      } else {
        await post(endpoints.vocabulary.create(), payload);
        setMessage("Vocabulario creado");
      }
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch {
      setError("Error al guardar el vocabulario");
    }
  };

  const handleEdit = (item: Vocabulary) => {
    setFormData({
      word: item.word,
      meaning: item.meaning || "",
      example: item.example || "",
      category: item.category || "",
      difficulty: item.difficulty || "",
      audioRecording: item.audioRecording || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      await remove(endpoints.vocabulary.delete(selectedId));
      refetch();
    } catch {
      setError("Error al eliminar");
    } finally {
      setDeleteModalOpen(false);
      setSelectedId(null);
    }
  };

  const cancelEdit = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const isLoading = loading || posting || updating || deleting;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vocabulario</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[#9d5da0] hover:bg-[#89508b] text-white rounded-md transition"
          >
            {showForm ? "Cerrar" : "Agregar palabra"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Palabra *</label>
              <input
                type="text"
                name="word"
                value={formData.word}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                placeholder="Inglés"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Definición</label>
              <input
                type="text"
                name="meaning"
                value={formData.meaning}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                placeholder="Traducción / Definición"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ejemplo</label>
              <textarea
                name="example"
                value={formData.example}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                placeholder="Oración de ejemplo"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                >
                  <option value="">Seleccionar</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dificultad</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                >
                  <option value="">Seleccionar</option>
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff.value} value={diff.value}>{diff.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Audio (opcional)</label>
              {formData.audioRecording ? (
                <div className="space-y-2">
                  <AudioPlayer src={formData.audioRecording} />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, audioRecording: "" }))}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Eliminar audio
                  </button>
                </div>
              ) : (
                <VoiceRecorder onSave={handleAudioSave} />
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#9d5da0] hover:bg-[#89508b] text-white rounded-md transition disabled:opacity-50"
              >
                {isLoading ? "Guardando..." : editingId ? "Actualizar" : "Guardar"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}

        {loading && <p>Cargando vocabulario...</p>}
        {fetchError && <p className="text-red-500">Error: {fetchError}</p>}
        
        {!loading && !fetchError && vocabulary && (
          <div className="space-y-4">
            {vocabulary.length === 0 ? (
              <p className="text-center text-gray-500">No hay vocabulario guardado</p>
            ) : (
              vocabulary.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{item.word}</h3>
                      {item.meaning && (
                        <p className="text-gray-600 dark:text-gray-400">{item.meaning}</p>
                      )}
                      {item.example && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                          "{item.example}"
                        </p>
                      )}
                      <div className="flex gap-2 text-xs">
                        {item.category && (
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                            {item.category}
                          </span>
                        )}
                        {item.difficulty && (
                          <span className={`px-2 py-1 rounded ${
                            item.difficulty === 'easy' ? 'bg-green-200 dark:bg-green-800' :
                            item.difficulty === 'medium' ? 'bg-yellow-200 dark:bg-yellow-800' :
                            'bg-red-200 dark:bg-red-800'
                          }`}>
                            {item.difficulty}
                          </span>
                        )}
                      </div>
                      {item.audioRecording && (
                        <div className="mt-2">
                          <AudioPlayer src={item.audioRecording} />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar esta palabra?"
        />
      </div>
    </div>
  );
};

export default VocabularyPage;
