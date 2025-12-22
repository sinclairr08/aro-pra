"use client";

import "@/app/globals.css";
import { SimpleLinkCard } from "@/components/link/SimpleLinkCard";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { FormLayout } from "@/components/layout/FormLayout";

interface AdminLoginedPageProps {
  onLogout: () => void;
}

const AdminLoginedPage = ({ onLogout }: AdminLoginedPageProps) => {
  const subPages: string[] = ["version", "link"];
  const router = useRouter();
  const handleLogout = () => {
    onLogout();
    router.refresh();
  };

  return (
    <FormLayout title="Admin Page">
      <div className="flex flex-col gap-4">
        {subPages.map((subPage, index) => (
          <SimpleLinkCard
            key={index}
            id={index}
            name={subPage}
            location={`admin/${subPage}`}
          />
        ))}
      </div>

      <div className="pt-6 mt-6 border-t border-gray-100">
        <SubmitButton type="button" classType="red" onClick={handleLogout}>
          로그아웃
        </SubmitButton>
      </div>
    </FormLayout>
  );
};

export default function AdminPage() {
  const { logout } = useAdminAuth();

  return <AdminLoginedPage onLogout={logout} />;
}
