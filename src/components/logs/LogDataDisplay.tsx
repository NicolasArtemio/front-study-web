import useFetch from "../../hooks/useFetch";

interface LogItem {
  id: number;
  title: string;
  content: string;
  category: string | null;
  date: string;
}

const LogDataDisplay = ({ resource }: { resource: string }) => {
  const { data, loading, error } = useFetch<LogItem[]>(resource);

  if (loading) return <p>Cargando {resource}...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No hay datos para mostrar</p>;

  return (
    <div >
     {data.map(log => (
      <div
        key={log.id}
        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-4 mb-4 transition hover:shadow-md"
      >
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-400  mb-1">
          {log.title}
        </h3>

        <p className="text-gray-700 dark:text-gray-400 mb-2">
          {log.content}
        </p>

        <div className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
          <p>
            <span className="font-medium">Categoría:</span> {log.category ?? "Sin categoría"}
          </p>
          <p>
            <span className="font-medium">Fecha:</span> {new Date(log.date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    ))}

    </div>
  );
};

export default LogDataDisplay;
