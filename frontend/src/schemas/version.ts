import { z } from "zod";
import { VersionRequest } from "@/types/version";

export const VersionSchema = z.object({
  version: z
    .string()
    .regex(/^v\d+\.\d+\.\d+$/, "v1.2.3 형태의 버전을 입력해 주세요"),
  updatedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형태의 날짜를 입력해 주세요"),
  description: z
    .array(
      z
        .string()
        .transform((str) => str.trim())
        .refine(
          (str) => str.length > 0 && str.length <= 100,
          "공백 제외 1자 이상 100자 이하로 입력해 주세요",
        ),
    )
    .min(1, "1개 이상의 설명을 입력해 주세요"),
}) satisfies z.ZodType<VersionRequest>;
