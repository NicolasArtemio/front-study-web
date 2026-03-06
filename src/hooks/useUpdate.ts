import { useState } from "react";

function useUpdate<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (url: string, payload: unknown) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
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

  return { update, data, loading, error, reset };
}

export default useUpdate;
