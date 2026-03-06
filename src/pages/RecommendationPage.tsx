import { useState, type ChangeEvent, type FormEvent } from "react";
import useFetch from "../hooks/useFetch";
import usePost from "../hooks/usePost";
import useUpdate from "../hooks/useUpdate";
import useDelete from "../hooks/useDelete";
import { endpoints } from "../services/api";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import Layout from "../components/Layout";
import type { Recommendation, CreateRecommendationDTO } from "../types";

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

const TYPES = [
  { value: "book", label: "Libro" },
  { value: "video", label: "Video" },
  { value: "podcast", label: "Podcast" },
  { value: "website", label: "Sitio Web" },
];

const PRIORITIES = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

interface FormData {
  title: string;
  description: string;
  category: string;
  type: string;
  url: string;
  priority: string;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  category: "",
  type: "",
  url: "",
  priority: "",
};

const RecommendationPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: recommendations, loading, error: fetchError, refetch } = useFetch<Recommendation[]>("recommendations");
  const { post, loading: posting } = usePost<Recommendation>();
  const { update, loading: updating } = useUpdate<Recommendation>();
  const { remove, loading: deleting } = useDelete();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const payload: CreateRecommendationDTO = {
      title: formData.title,
      content: formData.description,
      category: formData.category || undefined,
      type: (formData.type as "book" | "video" | "podcast" | "website") || undefined,
      url: formData.url || undefined,
      priority: (formData.priority as "low" | "medium" | "high") || undefined,
    };

    try {
      if (editingId) {
        await update(endpoints.recommendations.update(editingId), payload);
        setMessage("Recomendación actualizada");
      } else {
        await post(endpoints.recommendations.create(), payload);
        setMessage("Recomendación guardada");
      }
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch {
      setError("Error al guardar");
    }
  };

  const handleEdit = (item: Recommendation) => {
    setFormData({
      title: item.title,
      description: item.content,
      category: item.category || "",
      type: item.type || "",
      url: item.url || "",
      priority: item.priority || "",
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
      await remove(endpoints.recommendations.delete(selectedId));
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

  const getTypeLabel = (type: string | null): string => {
    const found = TYPES.find(t => t.value === type);
    return found ? found.label : type || "";
  };

  const getPriorityColor = (priority: string | null): string => {
    switch (priority) {
      case "high": return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "medium": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "low": return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default: return "bg-gray-100 dark:bg-gray-700";
    }
  };

  return (
    <Layout showBreadcrumbs>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Recomendaciones</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {showForm ? "Cerrar" : "Agregar recomendación"}
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
                  placeholder="Nombre del recurso"
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
                  placeholder="Descripción del recurso"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="relative z-20 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Seleccionar</option>
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Prioridad</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="relative z-20 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Seleccionar</option>
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL (opcional)</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                  placeholder="https://..."
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

          {loading && <p>Cargando recomendaciones...</p>}
          {fetchError && <p className="text-red-500">Error: {fetchError}</p>}

          {!loading && !fetchError && recommendations && (
            <div className="space-y-4">
              {recommendations.length === 0 ? (
                <p className="text-center text-gray-500">No hay recomendaciones guardadas</p>
              ) : (
                recommendations.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          {item.type && (
                            <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded text-xs">
                              {getTypeLabel(item.type)}
                            </span>
                          )}
                          {item.priority && (
                            <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-500 hover:text-purple-600 hover:underline text-sm transition-colors"
                          >
                            Ver recurso →
                          </a>
                        )}
                        {item.category && (
                          <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-slate-700 text-white text-sm rounded hover:bg-slate-600 transition"
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
            message="¿Estás seguro de que deseas eliminar esta recomendación?"
          />
        </div>
      </div>
    </Layout>
  );
};

export default RecommendationPage;
