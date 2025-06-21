"use client";

import "@/app/globals.css";
import { SimpleLinkCard } from "@/components/link/SimpleLinkCard";
import { useForm } from "react-hook-form";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

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
