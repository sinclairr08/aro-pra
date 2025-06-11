"use client";

import "@/app/globals.css";
import { useForm } from "react-hook-form";
import { SubmitButton } from "@/components/form/SubmitButton";
import { InputField } from "@/components/form/InputField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface LinkRequest {
  name: string;
  url: string;
}

const linkSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(100, "이름은 100자 이하여야 합니다"),
  url: z
    .string()
    .min(1, "URL을 입력해주세요")
    .url("올바른 URL 형식을 입력해주세요")
    .refine(
      (url: string) => url.startsWith("http://") || url.startsWith("https://"),
      "http 혹은 https로 시작되는 URL을 입력해주세요",
    ),
}) satisfies z.ZodType<LinkRequest>;

export default function AdminLinkPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkRequest>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const onSubmit = (data: LinkRequest) => {
    console.log(data);
    reset();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        링크 추가용 관리자
      </h1>

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
    </div>
  );
}
