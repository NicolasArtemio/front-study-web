import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Layout from "../components/Layout";
import BackButton from "../components/BackButton";

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

  if (loading) {
    return (
      <Layout showBreadcrumbs>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showBreadcrumbs>
        <p className="text-red-500">Error: {error}</p>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout showBreadcrumbs>
        <p>No hay datos para mostrar</p>
      </Layout>
    );
  }

  return (
    <Layout showBreadcrumbs>
      <div className="max-w-2xl mx-auto space-y-4 roboto-mono">
        <BackButton to="/logs" label="Back to Logs" />

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
    </Layout>
  );
};

export default SingleLogPage;
