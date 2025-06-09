import { UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  type: "text" | "number";
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: string;
}

export const InputField = ({
  label,
  name,
  type,
  placeholder,
  register,
  error,
}: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
};
