import axios from "axios";
import { useEffect, useState } from "react";

interface useLoginApiReturn {
  success: boolean;
  message?: string;
}

const useAdminLoginApi = async (
  password: string,
): Promise<useLoginApiReturn> => {
  try {
    const { data } = await axios.post(
      "/api/v1/admin/login",
      { password },
      { withCredentials: true },
    );

    return {
      success: data.success,
      message: data.message,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, message };
  }
};

const useAdminLogoutApi = async (): Promise<void> => {
  try {
    await axios.post("/api/v1/admin/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error(error);
  }
};

const checkAdminAuthStatus = async (): Promise<boolean> => {
  try {
    const { data } = await axios.get("api/v1/admin/profile", {
      withCredentials: true,
    });
    return data.success;
  } catch (error) {
    return false;
  }
};

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkAdminAuthStatus();
      setIsAuthenticated(authStatus);
    };

    checkAuth();
  }, []);

  const login = async (password: string) => {
    const result = await useAdminLoginApi(password);

    if (result.success) {
      setIsAuthenticated(true);
      return;
    }

    console.error(result.message);
  };

  const logout = async () => {
    await useAdminLogoutApi();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
