import "@/app/globals.css";
import Link from "next/link";

interface LinkCard {
  id: number;
  name: string;
  url: string;
}

const linkCards: LinkCard[] = [
  { id: 1, name: "Mn", url: "https://molunote.oopy.io/" },
  { id: 2, name: "AI", url: "https://arona.ai/" },
  { id: 3, name: "GONGSIKJP", url: "https://bluearchive.jp/" },
  { id: 4, name: "GONGSIKKR", url: "https://forum.nexon.com/bluearchive/" },
];

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {linkCards.map((card: LinkCard) => (
        <Link
          href={card.url}
          key={card.id}
          className="block p-4 rounded-lg border transition-all duration-200 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow"
        >
          <div className="text-lg font-semibold">{card.name}</div>
        </Link>
      ))}
    </div>
  );
}
