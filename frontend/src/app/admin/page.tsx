"use client";

import "@/app/globals.css";
import { SimpleLinkCard } from "@/components/link/SimpleLinkCard";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useRouter } from "next/navigation";
import axios from "axios";

const TMP_ADMIN_PASSWORD = "test123";

const setCookie = (name: string, value: string, days: number = 1) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }

  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const getJwtToken = (): string | null => {
  return getCookie("adminToken");
};

const setJwtToken = (token: string) => {
  setCookie("adminToken", token);
};

const removeJwtToken = () => {
  deleteCookie("adminToken");
};

const isValidToken = (): boolean => {
  const token = getJwtToken();
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
}

const useLoginApi = async (password: string): Promise<useLoginApiReturn> => {
  try {
    const { data } = await axios.post("/api/admin/login", { password });

    if (data.success) {
      return { success: true, token: data.data.token };
    } else {
      return { success: false };
    }
  } catch (error) {
    return { success: false };
  }
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const validToken = isValidToken();
      setIsAuthenticated(validToken);
    };

    if (!isValidToken() && getJwtToken()) {
      removeJwtToken();
    }

    checkAuth();
  }, []);

  const login = async (password: string) => {
    const result = await useLoginApi(password);
    if (result.success && result.token) {
      setJwtToken(result.token);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    removeJwtToken();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

interface AdminLoginFormData {
  password: string;
}

interface AdminLoginFormProps {
  onLogin: (password: string) => Promise<void>;
}

interface AdminLoginedPageProps {
  onLogout: () => void;
}

const AdminLoginForm = ({ onLogin }: AdminLoginFormProps) => {
  const { register, handleSubmit } = useForm<AdminLoginFormData>();
  const onSubmit = async ({ password }: AdminLoginFormData) => {
    await onLogin(password);
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">관리자 로그인</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="password"
              {...register("password")}
              placeholder="비밀번호"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <SubmitButton
            type="submit"
            onClick={handleSubmit(onSubmit)}
            classType="blue"
          >
            로그인
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};

const AdminLoginedPage = ({ onLogout }: AdminLoginedPageProps) => {
  const subPages: string[] = ["version", "link"];
  const router = useRouter();
  const handleLogout = () => {
    onLogout();
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Page</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {subPages.map((subPage, index) => (
            <SimpleLinkCard
              key={index}
              id={index}
              name={subPage}
              location={`admin/${subPage}`}
            />
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <div className="w-32">
            <SubmitButton type="button" classType="red" onClick={handleLogout}>
              로그아웃
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const { isAuthenticated, login, logout } = useAuth();

  return isAuthenticated ? (
    <AdminLoginedPage onLogout={logout} />
  ) : (
    <AdminLoginForm onLogin={login} />
  );
}
