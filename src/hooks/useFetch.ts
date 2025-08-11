import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:3000/api/v1";

function useFetch<T>(resource: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resource) return;

    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/${resource}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((json: T) => {  // indica que json tiene tipo T
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [resource]);

  return { data, loading, error };
}

export default useFetch;
