"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { Loading } from "@/components/common/Loading";

interface VersionCardProps {
  id: number;
  version: string;
  updatedAt: string;
  description: string[];
}

const defaultVersionCards: VersionCardProps[] = [
  {
    id: 0,
    version: "v0.0.0",
    updatedAt: "2025-05-04",
    description: ["프로젝트 설정"],
  },
  {
    id: 1,
    version: "v0.0.1",
    updatedAt: "2025-05-13",
    description: ["메인 페이지 추가", "버전 페이지 추가"],
  },
];

const VersionCard: React.FC<VersionCardProps> = ({
  version,
  updatedAt,
  description,
}) => {
  return (
    <div className="block p-4 rounded-lg border transition-all duration-200 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm font-semibold text-gray-800">{version}</div>
        <div className="text-xs text-gray-500">{updatedAt}</div>
      </div>
      <div className="border-t border-gray-200 mt-3 pt-3">
        <ul className="list-disc list-inside space-y-1">
          {description.map((item, index) => (
            <li key={index} className="text-sm text-gray-600">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { data: versionCards, loading } = useApi<VersionCardProps[]>({
    apiUrl: "/api/v1/versions",
    defaultValue: defaultVersionCards,
  });

  const sortedVersionCards = [...versionCards].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      {sortedVersionCards.map((version: VersionCardProps) => (
        <VersionCard key={version.id} {...version} />
      ))}
      {loading && <Loading />}
    </div>
  );
}
