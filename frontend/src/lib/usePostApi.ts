import { useState } from "react";
import axios from "axios";

export interface usePostApiProps {
  apiUrl: string;
}

export const usePostApi = <T>({ apiUrl }: usePostApiProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const postData = async (data: T) => {
    try {
      setLoading(true);

      await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading };
};
