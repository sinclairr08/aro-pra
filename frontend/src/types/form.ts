import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

export interface BaseInputFieldProps {
  label: string;
  name: string;
  type: "text" | "number";
  placeholder?: string;
  register: UseFormRegister<any>;
}

export interface DynamicInputFieldProps extends BaseInputFieldProps {
  fields: FieldArrayWithId[];
  append: UseFieldArrayAppend<any>;
  remove: UseFieldArrayRemove;
  minItems?: number;
  errors: any;
}
