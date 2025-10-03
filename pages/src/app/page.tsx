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
      (acc[card.section] ||= []).push(card);
      return acc;
    },
    {} as Record<string, LinkCardProps[]>,
  );

  return (
    <ContentLayout title="링크 모음">
      {Object.entries(groupedBySection).map(([section, cards]) => (
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
