"use client";

import "@/app/globals.css";
import { SimpleLinkCard } from "@/components/link/SimpleLinkCard";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { SubmitButton } from "@/components/form/SubmitButton";

const TMP_ADMIN_PASSWORD = "test123";

const checkAdmin = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isAdmin") === "true";
  }

  return false;
};

const loginAdmin = (password: string) => {
  if (password === TMP_ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    return true;
  }

  return false;
};

const logoutAdmin = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAdmin");
  }
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
  const { register, handleSubmit, setError } = useForm<AdminLoginFormData>();
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
            <SubmitButton type="button" classType="red" onClick={doLogout}>
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
