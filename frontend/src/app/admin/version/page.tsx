"use client";

import "@/app/globals.css";
import { useFieldArray, useForm } from "react-hook-form";
import { SubmitButton } from "@/components/common/SubmitButton";
import { InputField } from "@/components/common/InputField";
import { DynamicInputField } from "@/components/common/DynamicInputField";

interface VersionRequest {
  version: string;
  updatedDate: string;
  description: string[];
}

export default function AdminVersionPage() {
  const { register, handleSubmit, control, reset } = useForm<VersionRequest>({
    defaultValues: {
      version: "",
      updatedDate: "",
      description: [" "],
    },
  });

  const { fields, append, remove } = useFieldArray<VersionRequest>({
    control,
    name: "description",
  } as any);

  const onSubmit = (data: VersionRequest) => {
    console.log(data);
    reset();
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
        />

        <InputField
          label="업데이트 날짜"
          name="updatedDate"
          type="text"
          register={register}
          placeholder="YYYY-MM-DD"
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
