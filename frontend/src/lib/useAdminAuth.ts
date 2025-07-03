"use client";

import axios from "axios";
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

export const useAdminAuth = () => {
  const router = useRouter();

  const login = async (password: string) => {
    const result = await useAdminLoginApi(password);

    if (result.success) {
      router.push("/admin");
      return;
    }

    router.push(`/http/${result.status}`);
  };

  const logout = async () => {
    await useAdminLogoutApi();
    router.push("/admin/login");
  };

  return { login, logout };
};
