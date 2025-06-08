"use client";

import "@/app/globals.css";
import { useForm } from "react-hook-form";
import { SubmitButton } from "@/components/common/SubmitButton";
import { InputField } from "@/components/common/InputField";

interface LinkRequest {
  name: string;
  url: string;
}

export default function AdminLinkPage() {
  const { register, handleSubmit, reset } = useForm<LinkRequest>({
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
        />

        <InputField
          label="URL"
          name="url"
          type="text"
          register={register}
          placeholder="https://site.url"
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
