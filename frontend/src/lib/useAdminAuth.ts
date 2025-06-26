import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface useLoginApiReturn {
  success: boolean;
  message?: string;
  status: number;
}

const useAdminLoginApi = async (
  password: string,
): Promise<useLoginApiReturn> => {
  try {
    const { data, status } = await axios.post(
      "/api/v1/admin/login",
      { password },
      { withCredentials: true },
    );

    return {
      success: data.success,
      message: data.message,
      status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, message, status: 401 };
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
  const router = useRouter();

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
      router.push("/admin");
      return;
    }

    console.error(result.message);
    router.push(`/http/${result.status}`);
  };

  const logout = async () => {
    await useAdminLogoutApi();
    setIsAuthenticated(false);
    router.push("/admin");
  };

  return { isAuthenticated, login, logout };
};
