import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { SubmitButton } from "@/components/form/SubmitButton";
import { BaseInputFieldProps } from "@/types/form";
import { BaseInput } from "@/components/form/BaseInput";

interface DynamicInputFieldProps extends BaseInputFieldProps {
  fields: FieldArrayWithId[];
  append: UseFieldArrayAppend<any>;
  remove: UseFieldArrayRemove;
  minItems?: number;
  errors: any;
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
  errors,
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
      {fields.map((field, i) => {
        const error = Array.isArray(errors) ? errors[i] : undefined;

        return (
          <div key={i} className="space-y-1">
            <div className="flex gap-2">
              <BaseInput
                name={`${name}.${i}` as const}
                type={type}
                register={register}
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
            {error && <span className="text-red-600">{error.message}</span>}
          </div>
        );
      })}

      <SubmitButton type="button" classType="blue" onClick={handleAppendItem}>
        추가
      </SubmitButton>
    </div>
  );
};
