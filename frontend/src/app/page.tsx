"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { Loading } from "@/components/common/Loading";
import { LinkCardProps } from "@/types/link";
import { LinkCard } from "@/components/link/LinkCard";
import { defaultLinkCards } from "@/constants/defaultValues";

export default function HomePage() {
  const { data: linkCards, loading } = useApi<LinkCardProps[]>({
    apiUrl: "/api/v1/links",
    defaultValue: defaultLinkCards,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {linkCards.map((card: LinkCardProps) => (
        <LinkCard key={card.id} {...card} />
      ))}
      {loading && <Loading />}
    </div>
  );
}
