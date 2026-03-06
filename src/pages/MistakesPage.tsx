import { useState, type ChangeEvent, type FormEvent } from "react";
import useFetch from "../hooks/useFetch";
import usePost from "../hooks/usePost";
import useUpdate from "../hooks/useUpdate";
import useDelete from "../hooks/useDelete";
import { endpoints } from "../services/api";
import VoiceRecorder from "../components/VoiceRecorder";
import AudioPlayer from "../components/AudioPlayer";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import Layout from "../components/Layout";
import type { Mistake, CreateMistakeDTO } from "../types";

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

interface FormData {
  title: string;
  description: string;
  correction: string;
  category: string;
  audioRecording: string;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  correction: "",
  category: "",
  audioRecording: "",
};

const MistakesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: mistakes, loading, error: fetchError, refetch } = useFetch<Mistake[]>("mistakes");
  const { post, loading: posting } = usePost<Mistake>();
  const { update, loading: updating } = useUpdate<Mistake>();
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
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("El título y la descripción son obligatorios");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: CreateMistakeDTO = {
      title: formData.title,
      description: formData.description,
      correction: formData.correction || undefined,
      category: formData.category || undefined,
      audioRecording: formData.audioRecording || undefined,
    };

    try {
      if (editingId) {
        await update(endpoints.mistakes.update(editingId), payload);
        setMessage("Error actualizado");
      } else {
        await post(endpoints.mistakes.create(), payload);
        setMessage("Error registrado");
      }
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch {
      setError("Error al guardar");
    }
  };

  const handleEdit = (item: Mistake) => {
    setFormData({
      title: item.title,
      description: item.description,
      correction: item.correction || "",
      category: item.category || "",
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
      await remove(endpoints.mistakes.delete(selectedId));
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
    <Layout showBreadcrumbs>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Mis Errores</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {showForm ? "Cerrar" : "Agregar error"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-4 relative z-50 overflow-visible"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                  placeholder="Error que cometes frecuentemente"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                  placeholder="Explica en qué consiste el error"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Corrección</label>
                <textarea
                  name="correction"
                  value={formData.correction}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                  placeholder="Cómo se corrige correctamente"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="relative z-20 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Seleccionar</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Audio (opcional)</label>
                <p className="text-xs text-gray-500 mb-2">
                  Graba cómo pronuncias mal la palabra/frase
                </p>
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
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Guardando..." : editingId ? "Actualizar" : "Guardar"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          {loading && <p>Cargando errores...</p>}
          {fetchError && <p className="text-red-500">Error: {fetchError}</p>}

          {!loading && !fetchError && mistakes && (
            <div className="space-y-4">
              {mistakes.length === 0 ? (
                <p className="text-center text-gray-500">No hay errores registrados</p>
              ) : (
                mistakes.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                        {item.correction && (
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              Corrección: {item.correction}
                            </p>
                          </div>
                        )}
                        {item.category && (
                          <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                            {item.category}
                          </span>
                        )}
                        {item.audioRecording && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Tu pronunciación:</p>
                            <AudioPlayer src={item.audioRecording} />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition"
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
            message="¿Estás seguro de que deseas eliminar este error?"
          />
        </div>
      </div>
    </Layout>
  );
};

export default MistakesPage;
