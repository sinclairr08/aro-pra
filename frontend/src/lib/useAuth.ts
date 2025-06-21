import axios from "axios";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookies";

const getAdminJwtToken = (): string | null => {
  return getCookie("adminToken");
};

const setAdminJwtToken = (token: string) => {
  setCookie("adminToken", token);
};

const removeAdminJwtToken = () => {
  deleteCookie("adminToken");
};

const isValidAdminToken = (): boolean => {
  const token = getAdminJwtToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

interface useLoginApiReturn {
  success: boolean;
  token?: string;
  message?: string;
}

const useLoginApi = async (password: string): Promise<useLoginApiReturn> => {
  try {
    const { data } = await axios.post("/api/v1/admin/login", { password });

    if (data.success) {
      return { success: true, token: data.data.token };
    } else {
      return { success: false, message: "Failed to login" };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, message };
  }
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const validToken = isValidAdminToken();
      setIsAuthenticated(validToken);
    };

    if (!isValidAdminToken() && getAdminJwtToken()) {
      removeAdminJwtToken();
    }

    checkAuth();
  }, []);

  const login = async (password: string) => {
    const result = await useLoginApi(password);

    if (result.success && result.token) {
      setAdminJwtToken(result.token);
      setIsAuthenticated(true);

      return;
    }

    console.error(result.message);
  };

  const logout = () => {
    removeAdminJwtToken();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
