"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { Loading } from "@/components/common/Loading";
import { LinkCardProps } from "@/types/link";
import { LinkCard } from "@/components/link/LinkCard";
import { defaultLinkCards } from "@/constants/defaultValues";
import { ContentLayout } from "@/components/layout/ContentLayout";

export default function HomePage() {
  const { data: linkCards, loading } = useApi<LinkCardProps[]>({
    apiUrl: "/api/v1/links",
    defaultValue: defaultLinkCards,
  });

  const groupedBySection = linkCards.reduce(
    (acc, card) => {
      const section = card.section?.trim() || "기타";
      (acc[section] ||= []).push(card);
      return acc;
    },
    {} as Record<string, LinkCardProps[]>,
  );

  // 우선 순위: 공식 > 정보 > ... > 기타
  const sectionOrder = ["공식", "정보"];
  const sortedSections = Object.entries(groupedBySection).sort(([a], [b]) => {
    const indexA = sectionOrder.indexOf(a);
    const indexB = sectionOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    if (a === "기타") return 1;
    if (b === "기타") return -1;

    return a.localeCompare(b, "ko");
  });

  return (
    <ContentLayout title="링크 모음">
      {sortedSections.map(([section, cards]) => (
        <div key={section} className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-700">{section}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cards.map((card: LinkCardProps) => (
              <LinkCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      ))}
      {loading && <Loading />}
    </ContentLayout>
  );
}
