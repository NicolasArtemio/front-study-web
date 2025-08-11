import { useState } from "react";

function usePost<T> (){
    
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const post = async (url: string, payload: unknown) => {
        setLoading(true);
        setError(null);

        try {
            const response =  await fetch(url, {
                method:'POST',
                headers:{
                    'content-type':"application/json"
                },
                body: JSON.stringify(payload)
            })

            const json = await response.json();

            if(!response.ok) {
                throw new Error(json.message || `HTTP error: ${response.status}`)
            }

            setData(json);

        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }

    }

    return {post, data, loading, error}
}
export default usePost;