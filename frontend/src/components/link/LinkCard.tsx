import Link from "next/link";
import Image from "next/image";
import { getFaviconUrl } from "@/lib/utils";
import { LinkCardProps } from "@/types/link";

export const LinkCard: React.FC<LinkCardProps> = ({
  id,
  name,
  url,
}: LinkCardProps) => {
  return (
    <Link
      href={url}
      key={id}
      className="block p-4 rounded-lg border transition-all duration-200 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow"
    >
      <div className="flex items-center justify-center w-full">
        <div className="w-8 h-8 mr-3 p-1 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center">
          <Image
            src={getFaviconUrl(url)}
            alt={`${name} favicon`}
            width={32}
            height={32}
          />
        </div>
        <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">
          {name}
        </div>
      </div>
    </Link>
  );
};
