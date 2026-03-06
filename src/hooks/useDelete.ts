import { useState } from "react";

function useDelete<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "DELETE",
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || `HTTP error: ${response.status}`);
      }

      setData(json);
      return json;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { remove, data, loading, error, reset };
}

export default useDelete;
