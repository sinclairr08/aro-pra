import { ReactNode } from "react";

interface FormLayoutProps {
  children: ReactNode;
  title: string;
}

export const FormLayout = ({ children, title }: FormLayoutProps) => {
  return (
    <div className="pt-8 pb-8 px-4">
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{title}</h1>
        {children}
      </div>
    </div>
  );
};
