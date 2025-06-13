import { z } from "zod";
import { LinkRequest } from "@/types/link";

export const LinkSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(100, "이름은 100자 이하여야 합니다"),
  url: z
    .string()
    .min(1, "URL을 입력해주세요")
    .url("올바른 URL 형식을 입력해주세요")
    .refine(
      (url: string) => url.startsWith("http://") || url.startsWith("https://"),
      "http 혹은 https로 시작되는 URL을 입력해주세요",
    ),
}) satisfies z.ZodType<LinkRequest>;
