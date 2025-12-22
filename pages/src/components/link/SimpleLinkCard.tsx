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
      className="block px-6 py-3 rounded-lg border transition-all duration-200 bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-center justify-center w-full">
        <div className="text-base font-semibold text-gray-800 hover:text-blue-600">
          {name}
        </div>
      </div>
    </Link>
  );
};
