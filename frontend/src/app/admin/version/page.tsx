"use client";

import "@/app/globals.css";
import { useFieldArray, useForm } from "react-hook-form";
import { SubmitButton } from "@/components/form/SubmitButton";
import { InputField } from "@/components/form/InputField";
import { DynamicInputField } from "@/components/form/DynamicInputField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostApi } from "@/lib/usePostApi";
import { Loading } from "@/components/common/Loading";

interface VersionRequest {
  version: string;
  updatedDate: string;
  description: string[];
}

const versionSchema = z.object({
  version: z
    .string()
    .regex(/^v\d+\.\d+\.\d+$/, "v1.2.3 형태의 버전을 입력해주세요"),
  updatedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형태의 날짜를 입력해 주세요"),
  description: z
    .array(
      z
        .string()
        .transform((str) => str.trim())
        .refine((str) => str.length > 0, "공백 제외 1자 이상 입력해주세요"),
    )
    .min(1, "1개 이상의 설명을 입력해주세요"),
}) satisfies z.ZodType<VersionRequest>;

export default function AdminVersionPage() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<VersionRequest>({
    resolver: zodResolver(versionSchema),
    defaultValues: {
      version: "",
      updatedDate: "",
      description: [" "],
    },
  });
  const { postData, loading } = usePostApi<VersionRequest>({
    apiUrl: "/api/v1/versions",
  });

  const { fields, append, remove } = useFieldArray<VersionRequest>({
    control,
    name: "description",
  } as any);

  const onSubmit = async (data: VersionRequest) => {
    try {
      await postData(data);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        버전 추가용 관리자
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="버전"
          name="version"
          type="text"
          register={register}
          placeholder="v0.0.0"
          error={errors.version?.message}
        />

        <InputField
          label="업데이트 날짜"
          name="updatedDate"
          type="text"
          register={register}
          placeholder="YYYY-MM-DD"
          error={errors.updatedDate?.message}
        />

        <DynamicInputField
          label="설명"
          name="description"
          type="text"
          register={register}
          fields={fields}
          append={append}
          remove={remove}
          placeholder="설명을 적어주세요"
          errors={errors.description}
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
    </div>
  );
}
