"use client";

import "@/app/globals.css";
import { SimpleLinkCard } from "@/components/link/SimpleLinkCard";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useRouter } from "next/navigation";

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

const checkAdmin = () => {
  return getCookie("isAdmin") === "true";
};

const loginAdmin = (password: string) => {
  if (password === TMP_ADMIN_PASSWORD) {
    setCookie("isAdmin", "true", 1);
    return true;
  }

  return false;
};

const logoutAdmin = () => {
  deleteCookie("isAdmin");
};

interface AdminLoginFormData {
  password: string;
}

interface AdminLoginFormProps {
  doLogin: () => void;
}

interface AdminLoginedPageProps {
  doLogout: () => void;
}

const AdminLoginForm = ({ doLogin }: AdminLoginFormProps) => {
  const { register, handleSubmit } = useForm<AdminLoginFormData>();
  const onSubmit = ({ password }: AdminLoginFormData) => {
    if (loginAdmin(password)) {
      doLogin();
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">관리자 로그인</h1>

        <div className="mb-4">
          <input
            type="password"
            {...register("password")}
            placeholder="비밀번호"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

const AdminLoginedPage = ({ doLogout }: AdminLoginedPageProps) => {
  const subPages: string[] = ["version", "link"];
  const router = useRouter();
  const handleLogout = () => {
    doLogout();
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(checkAdmin());
  }, []);

  const doLogin = () => setIsAdmin(true);
  const doLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
  };

  return isAdmin ? (
    <AdminLoginedPage doLogout={doLogout} />
  ) : (
    <AdminLoginForm doLogin={doLogin} />
  );
}
