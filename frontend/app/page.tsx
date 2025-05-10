"use client";

import "@/app/globals.css";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

interface LinkCard {
  id: number;
  name: string;
  url: string;
}

const mockLinkCards: LinkCard[] = [
  { id: 1, name: "Mn", url: "https://molunote.oopy.io" },
  { id: 2, name: "AI", url: "https://arona.ai" },
  { id: 3, name: "GONGSIKJP", url: "https://bluearchive.jp" },
  { id: 4, name: "GONGSIKKR", url: "https://forum.nexon.com/bluearchive" },
  { id: 5, name: "SG", url: "http://schaledb.com" },
];

interface useApiProps<T> {
  apiUrl: string;
  defaultValue: T;
}

const useApi = <T,>({ apiUrl, defaultValue }: useApiProps<T>) => {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

const getFaviconUrl = (url: string): string => {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
};

const Loading = () => (
  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-cyan-400 border-r-pink-200/30 border-b-[#332c30]">
    <span className="sr-only">Loading...</span>
  </div>
);

export default function Home() {
  const { data: linkCards, loading } = useApi<LinkCard[]>({
    apiUrl: "/api/v1/links",
    defaultValue: mockLinkCards,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {linkCards.map((card: LinkCard) => (
        <Link
          href={card.url}
          key={card.id}
          className="block p-4 rounded-lg border transition-all duration-200 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow"
        >
          <div className="flex items-center justifA-center mb-4 w-full">
            <div className="w-8 h-8 mr-3 p-1 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center">
              <Image
                src={getFaviconUrl(card.url)}
                alt={`${card.name} favicon`}
                width={32}
                height={32}
              />
            </div>
            <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">
              {card.name}
            </div>
          </div>
        </Link>
      ))}
      {loading && <Loading />}
    </div>
  );
}
