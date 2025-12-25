import { z } from "zod";
import { LinkRequest } from "@/types/link";

export const LinkSchema = z.object({
  name: z
    .string()
    .transform((str) => str.trim())
    .refine(
      (str) => str.length > 0 && str.length <= 100,
      "공백 제외 1자 이상 100자 이하로 입력해 주세요",
    ),
  url: z
    .string()
    .min(1, "URL을 입력해 주세요")
    .url("올바른 URL 형식을 입력해 주세요")
    .refine(
      (url: string) => url.startsWith("http://") || url.startsWith("https://"),
      "http 혹은 https로 시작되는 URL을 입력해 주세요",
    ),
  section: z
    .string()
    .transform((str) => str.trim())
    .refine(
      (str) => str.length > 0 && str.length <= 50,
      "공백 제외 1자 이상 50자 이하로 입력해 주세요",
    ),
}) satisfies z.ZodType<LinkRequest>;
