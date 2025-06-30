import { UseFormRegister } from "react-hook-form";

interface BaseInputProps {
  name: string;
  type: "text" | "number" | "password";
  placeholder?: string;
  register: UseFormRegister<any>;
}

export const BaseInput = ({
  type,
  name,
  placeholder,
  register,
}: BaseInputProps) => (
  <input
    type={type}
    {...register(name)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder={placeholder}
  />
);
