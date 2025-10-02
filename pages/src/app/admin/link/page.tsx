"use client";

import "@/app/globals.css";
import { useForm } from "react-hook-form";
import { SubmitButton } from "@/components/form/SubmitButton";
import { InputField } from "@/components/form/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostApi } from "@/lib/usePostApi";
import { Loading } from "@/components/common/Loading";
import { LinkRequest } from "@/types/link";
import { LinkSchema } from "@/schemas/link";
import { FormLayout } from "@/components/layout/FormLayout";

export default function AdminLinkPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkRequest>({
    resolver: zodResolver(LinkSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });
  const { postData, loading } = usePostApi<LinkRequest>({
    apiUrl: "/api/v1/links",
  });

  const onSubmit = async (data: LinkRequest) => {
    try {
      await postData(data);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormLayout title="링크 추가용 관리자">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="이름"
          name="name"
          type="text"
          register={register}
          placeholder="사이트 이름을 입력하세요"
          error={errors.name?.message}
        />

        <InputField
          label="URL"
          name="url"
          type="text"
          register={register}
          placeholder="https://site.url"
          error={errors.url?.message}
        />

        <div className="flex gap-4 mt-6">
          <SubmitButton
            type="submit"
            onClick={handleSubmit(onSubmit)}
            classType="blue"
          >
            제출
          </SubmitButton>
          <SubmitButton type="button" onClick={() => reset()} classType="gray">
            초기화
          </SubmitButton>
        </div>
      </form>
      {loading && <Loading />}
    </FormLayout>
  );
}
