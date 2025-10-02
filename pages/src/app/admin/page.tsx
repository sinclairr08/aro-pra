"use client";

import "@/app/globals.css";
import { SimpleLinkCard } from "@/components/link/SimpleLinkCard";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { ContentLayout } from "@/components/layout/ContentLayout";

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
    <ContentLayout title="Admin Page">
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
    </ContentLayout>
  );
};

export default function AdminPage() {
  const { logout } = useAdminAuth();

  return <AdminLoginedPage onLogout={logout} />;
}
