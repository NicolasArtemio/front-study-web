import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

interface SingleLogPageProps {
  id: number;
  title: string;
  content: string;
  category: string | null;
  date: string;
}

type RouteParams = {
  id: string;
};

const SingleLogPage = () => {
  const { id } = useParams<RouteParams>();

  const { data, loading, error } = useFetch<SingleLogPageProps>(`logs/${id}`);
  if (loading) return <p>Cargando log...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No hay datos para mostrar</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4 roboto-mono">
      <Link
        to="/logs"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Volver a los logs
      </Link>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {data.title}
      </h2>

      <p className="text-gray-700 dark:text-gray-300">{data.content}</p>

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          <strong>Categoría:</strong> {data.category ?? "Sin categoría"}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(data.date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};
export default SingleLogPage;
