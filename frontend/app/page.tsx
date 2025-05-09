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

const mocklLinkCards: LinkCard[] = [
  { id: 1, name: "Mn", url: "https://molunote.oopy.io" },
  { id: 2, name: "AI", url: "https://arona.ai" },
  { id: 3, name: "GONGSIKJP", url: "https://bluearchive.jp" },
  { id: 4, name: "GONGSIKKR", url: "https://forum.nexon.com/bluearchive" },
  { id: 5, name: "SG", url: "http://schaledb.com" },
];

const fetchLinkCards = async (): Promise<LinkCard[]> => {
  const useApi = false;

  if (useApi) {
    try {
      const response = await axios.get("/api/v1/links");
      return response.data;
    } catch (error) {
      return mocklLinkCards;
    }
  }

  return Promise.resolve(mocklLinkCards);
};

const getFaviconUrl = (url: string): string => {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
};

export default function Home() {
  const [linkCards, setLinkCards] = useState<LinkCard[]>([]);

  useEffect(() => {
    const getLinkCards = async () => {
      const data = await fetchLinkCards();
      setLinkCards(data);
    };

    getLinkCards();
  }, []);

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
    </div>
  );
}
