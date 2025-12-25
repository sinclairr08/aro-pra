import { ReactNode } from "react";

interface FormLayoutProps {
  children: ReactNode;
  title: string;
  centered?: boolean;
}

export const FormLayout = ({ children, title, centered = false }: FormLayoutProps) => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className={centered ? "flex items-center justify-center min-h-[calc(100vh-6rem)]" : "max-w-md mx-auto"}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-8 pt-8 pb-2 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-800">
                {title}
              </h1>
            </div>
            <div className="px-8 py-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
