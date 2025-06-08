import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { SubmitButton } from "@/components/common/SubmitButton";

interface DynamicInputFieldProps {
  label: string;
  name: string;
  type: "text" | "number";
  fields: FieldArrayWithId[];
  append: UseFieldArrayAppend<any>;
  remove: UseFieldArrayRemove;
  minItems?: number;
  placeholder?: string;
  register: UseFormRegister<any>;
}

export const DynamicInputField = ({
  label,
  name,
  type,
  fields,
  append,
  remove,
  placeholder,
  minItems = 1,
  register,
}: DynamicInputFieldProps) => {
  const handleAppendItem = () => {
    append(" ");
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {fields.map((field, i) => (
        <div key={i} className="flex gap-2">
          <input
            type={type}
            {...register(`${name}.${i}` as const)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`${placeholder} ${i + 1}`}
          />

          <SubmitButton
            type="button"
            classType="red"
            onClick={() => handleRemoveItem(i)}
            disabled={fields.length <= minItems}
          >
            삭제
          </SubmitButton>
        </div>
      ))}

      <SubmitButton type="button" classType="blue" onClick={handleAppendItem}>
        추가
      </SubmitButton>
    </div>
  );
};
