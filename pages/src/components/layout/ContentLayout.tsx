import { ReactNode } from "react";

interface ContentLayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export const ContentLayout = ({
  children,
  className = "",
  title,
}: ContentLayoutProps) => {
  return (
    <div className="pt-4 pb-8 px-4">
      {title && <h1 className="text-xl font-bold mb-4 text-center text-gray-800">{title}</h1>}
      <div className={className}>{children}</div>
    </div>
  );
};
