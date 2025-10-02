"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { Loading } from "@/components/common/Loading";
import { VersionCardProps } from "@/types/version";
import { VersionCard } from "@/components/version/VersionCard";
import { defaultVersionCards } from "@/constants/defaultValues";
import { ContentLayout } from "@/components/layout/ContentLayout";

export default function HomePage() {
  const { data: versionCards, loading } = useApi<VersionCardProps[]>({
    apiUrl: "/api/v1/versions",
    defaultValue: defaultVersionCards,
  });

  return (
    <ContentLayout className="grid grid-cols-1 gap-4" title="버전 정보">
      {versionCards.map((version: VersionCardProps) => (
        <VersionCard key={version.id} {...version} />
      ))}
      {loading && <Loading />}
    </ContentLayout>
  );
}
