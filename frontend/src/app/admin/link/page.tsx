"use client";

import "@/app/globals.css";
import { useForm } from "react-hook-form";

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이름 *
          </label>
          <input
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="사이트 이름을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL *
          </label>
          <input
            {...register("url")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://site.url"
          />
        </div>
      </form>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
        >
          제출
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors font-medium"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
