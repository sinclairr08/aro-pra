import { UseFormRegister } from "react-hook-form";

export interface BaseInputFieldProps {
  label: string;
  name: string;
  type: "text" | "number";
  placeholder?: string;
  register: UseFormRegister<any>;
}
