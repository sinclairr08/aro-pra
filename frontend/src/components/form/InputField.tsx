import { BaseInputFieldProps } from "@/types/form";
import { BaseInput } from "@/components/form/BaseInput";

interface InputFieldProps extends BaseInputFieldProps {
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
      <BaseInput
        name={name}
        type={type}
        register={register}
        placeholder={placeholder}
      />
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
};
