import { Student } from "@/types/waifu";
import { LinkCardProps } from "@/types/link";
import { VersionCardProps } from "@/types/version";

export const defaultStudents: Student[] = [
  {
    name: "요시미",
    outfits: [
      {
        code: "CH0220",
        outfitName: "요시미(밴드)",
      },
      {
        code: "Yoshimi",
        outfitName: "요시미",
      },
    ],
    currentOutfitCode: "Yoshimi",
  },
  {
    name: "시로코",
    outfits: [
      {
        code: "Shiroko",
        outfitName: "시로코",
      },
      {
        code: "CH0188",
        outfitName: "시로코(수영복)",
      },
    ],
    currentOutfitCode: "Shiroko",
  },
  {
    name: "아루",
    outfits: [
      {
        code: "CH0240",
        outfitName: "아루(드레스)",
      },
      {
        code: "Aru",
        outfitName: "아루",
      },
      {
        code: "CH0084",
        outfitName: "아루(새해)",
      },
    ],
    currentOutfitCode: "Aru",
  },
];

export const defaultLinkCards: LinkCardProps[] = [
  { id: "1", name: "일섭 공식", url: "https://bluearchive.jp" },
  { id: "2", name: "한섭 공식", url: "https://forum.nexon.com/bluearchive" },
];

export const defaultVersionCards: VersionCardProps[] = [
  {
    id: "0",
    version: "v0.0.0",
    updatedDate: "2025-05-04",
    description: ["프로젝트 설정"],
  },
];
