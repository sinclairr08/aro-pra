"use client";

import { useForm } from "react-hook-form";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { BaseInput } from "@/components/form/BaseInput";
import { ContentLayout } from "@/components/layout/ContentLayout";

interface AdminLoginFormData {
  password: string;
}

interface AdminLoginFormProps {
  onLogin: (password: string) => Promise<void>;
}

const AdminLoginForm = ({ onLogin }: AdminLoginFormProps) => {
  const { register, handleSubmit } = useForm<AdminLoginFormData>();
  const onSubmit = async ({ password }: AdminLoginFormData) => {
    await onLogin(password);
  };
  return (
    <ContentLayout className="bg-gray-100 min-h-screen flex items-center justify-center -mt-4 -mb-8 -mx-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <BaseInput name="password" type="password" register={register} />
          </div>

          <SubmitButton
            type="submit"
            onClick={handleSubmit(onSubmit)}
            classType="blue"
          >
            Access
          </SubmitButton>
        </form>
      </div>
    </ContentLayout>
  );
};

export default function AdminPage() {
  const { login } = useAdminAuth();

  return <AdminLoginForm onLogin={login} />;
}
