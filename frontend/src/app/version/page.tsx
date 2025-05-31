"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { Loading } from "@/components/common/Loading";
import { VersionCardProps } from "@/types/versionCard";
import { VersionCard } from "@/components/version/VersionCard";

const defaultVersionCards: VersionCardProps[] = [
  {
    id: 0,
    version: "v0.0.0",
    updatedDate: "2025-05-04",
    description: ["프로젝트 설정"],
  },
  {
    id: 1,
    version: "v0.0.1",
    updatedDate: "2025-05-13",
    description: ["메인 페이지 추가", "버전 페이지 추가"],
  },
];

export default function HomePage() {
  const { data: versionCards, loading } = useApi<VersionCardProps[]>({
    apiUrl: "/api/v1/versions",
    defaultValue: defaultVersionCards,
  });

  const sortedVersionCards = [...versionCards].sort(
    (a, b) =>
      new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime(),
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
