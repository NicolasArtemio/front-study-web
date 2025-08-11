import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import usePost from "../../hooks/usePost";

interface LogFormData {
  title: string;
  content: string;
  category: string;
}

export const FormLog = (): JSX.Element => {
  const [formData, setFormData] = useState<LogFormData>({
    title: "",
    content: "",
    category: "",
  });

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const {
    post,
    loading,
    error: postError,
  } = usePost<LogFormData>();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title || !formData.content || !formData.category) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    setError(""); // limpia error si el formulario es válido
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await post("http://localhost:3000/api/v1/logs", formData);

    if (!postError) {
      setMessage("Log creado");
      setFormData({ title: "", content: "", category: "" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-6 p-6 rounded-md shadow-md space-y-6 roboto-mono"
      style={{
        backgroundColor: 'var(--background-color-light)',
        color: 'var(--text-color-light)',
      }}
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium"
          style={{ color: 'var(--text-color-light)' }}
        >
          Título
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-transparent"
          placeholder="Escribe el título"
          required
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium"
          style={{ color: 'var(--text-color-light)' }}
        >
          Contenido
        </label>
        <textarea
          name="content"
          id="content"
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-transparent"
          placeholder="Escribe el contenido"
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium"
          style={{ color: 'var(--text-color-light)' }}
        >
          Categoría
        </label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-transparent"
          required
        >
          <option value="">Selecciona una categoría</option>
          <option value="grammar">Grammar</option>
          <option value="listening">Listening</option>
          <option value="vocabulary">Vocabulary</option>
          <option value="speaking">Speaking</option>
          <option value="writing">Writing</option>
          <option value="pronunciation">Pronunciation</option>
          <option value="phrasal-verbs">Phrasal Verbs</option>
          <option value="reading">Reading</option>
        </select>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`w-full cursor-pointer flex justify-center items-center px-4 py-2 font-semibold rounded-md transition duration-200 ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#9d5da0] hover:bg-[#89508b] text-white'
            }`}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>


      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {postError && <p className="text-red-500 text-sm mt-2">{postError}</p>}
      {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
    </form>


  );
};
