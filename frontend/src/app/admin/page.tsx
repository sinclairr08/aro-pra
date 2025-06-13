"use client";

import "@/app/globals.css";
import { SimpleLinkCard } from "@/components/link/SimpleLinkCard";

export default function AdminPage() {
  const subPages: string[] = ["version", "link"];
  return (
    <>
      <h1 className="text-center p-2 mb-2">Admin Page</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subPages.map((subPage, index) => (
          <SimpleLinkCard
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
