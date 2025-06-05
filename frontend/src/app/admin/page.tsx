"use client";

import "@/app/globals.css";
import Link from "next/link";

interface PageCardProps {
  id: string | number;
  name: string;
  location: string;
}

const PageCard: React.FC<PageCardProps> = ({
  id,
  name,
  location,
}: PageCardProps) => {
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

export default function AdminPage() {
  const subPages: string[] = ["version", "link"];
  return (
    <>
      <h1 className="text-center p-2 mb-2">Admin Page</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subPages.map((subPage, index) => (
          <PageCard
            key={index}
            id={index}
            name={subPage}
            location={`admin/${subPage}`}
          />
        ))}
      </div>
    </>
  );
}
