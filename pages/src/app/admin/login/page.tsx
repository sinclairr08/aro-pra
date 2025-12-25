"use client";

import "@/app/globals.css";
import { useForm } from "react-hook-form";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { BaseInput } from "@/components/form/BaseInput";
import { FormLayout } from "@/components/layout/FormLayout";

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
    <FormLayout title="싯딤의 상자" centered={true}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <BaseInput name="password" type="password" register={register} />

        <SubmitButton
          type="submit"
          onClick={handleSubmit(onSubmit)}
          classType="blue"
        >
          Access
        </SubmitButton>
      </form>
    </FormLayout>
  );
};

export default function AdminPage() {
  const { login } = useAdminAuth();

  return <AdminLoginForm onLogin={login} />;
}
