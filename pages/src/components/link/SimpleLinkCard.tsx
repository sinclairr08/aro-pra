import { SimpleLinkCardProps } from "@/types/link";
import Link from "next/link";

export const SimpleLinkCard: React.FC<SimpleLinkCardProps> = ({
  id,
  name,
  location,
}: SimpleLinkCardProps) => {
  return (
    <Link
      href={location}
      key={id}
      className="block p-4 rounded-lg border transition-all duration-200 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow"
    >
      <div className="flex items-center justify-center w-full">
        <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">
          {name}
        </div>
      </div>
    </Link>
  );
};
