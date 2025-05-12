import { useEffect, useState } from "react";
import axios from "axios";

export interface useApiProps<T> {
  apiUrl: string;
  defaultValue: T;
}

export const useApi = <T>({ apiUrl, defaultValue }: useApiProps<T>) => {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
