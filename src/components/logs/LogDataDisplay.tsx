import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import ConfirmationModal from "../modals/ConfirmationModal";

interface LogItem {
  id: number;
  title: string;
  content: string;
  category: string | null;
  date: string;
}

const LogDataDisplay = ({ resource }: { resource: string }) => {
  const { data, loading, error } = useFetch<LogItem[]>(resource);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  const handleDeleteClick = (logId: number, e: React.MouseEvent) => {
    e.preventDefault(); // Previene navegación al hacer clic en "Eliminar"
    setSelectedLogId(logId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedLogId !== null) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/logs/${selectedLogId}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          window.location.reload(); // Puedes optimizar esto más adelante
        } else {
          console.error("Error al eliminar el log");
        }
      } catch (error) {
        console.error("Error al eliminar el log:", error);
      } finally {
        setIsModalOpen(false);
        setSelectedLogId(null);
      }
    }
  };

  if (loading) return <p>Cargando {resource}...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No hay datos para mostrar</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {data.map((log) => (
        <Link key={log.id} to={`/logs/${log.id}`} className="block">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-4 mb-4 transition hover:shadow-md cursor-pointer relative">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-400 mb-1">
              {log.title}
            </h3>

            <p className="text-gray-700 dark:text-gray-400 mb-2">
              {log.content}
            </p>

            <div className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
              <p>
                <span className="font-medium">Categoría:</span>{" "}
                {log.category ?? "Sin categoría"}
              </p>
              <p>
                <span className="font-medium">Fecha:</span>{" "}
                {new Date(log.date).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Botón eliminar */}
            <button
              onClick={(e) => handleDeleteClick(log.id, e)}
              className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </Link>
      ))}

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este registro?"
      />
    </div>
  );
};

export default LogDataDisplay;
