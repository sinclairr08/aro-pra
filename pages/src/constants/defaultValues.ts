import { Student } from "@/types/waifu";
import { LinkCardProps } from "@/types/link";
import { VersionCardProps } from "@/types/version";

export const defaultStudents: Student[] = [
  {
    name: "요시미",
    outfits: [
      {
        code: "ch0220",
        outfitName: "요시미(밴드)",
      },
      {
        code: "yoshimi",
        outfitName: "요시미",
      },
    ],
    currentOutfitCode: "yoshimi",
    school: "Trinity",
  },
  {
    name: "시로코",
    outfits: [
      {
        code: "shiroko",
        outfitName: "시로코",
      },
      {
        code: "ch0188",
        outfitName: "시로코(수영복)",
      },
    ],
    currentOutfitCode: "shiroko",
    school: "Abydos",
  },
  {
    name: "아루",
    outfits: [
      {
        code: "ch0240",
        outfitName: "아루(드레스)",
      },
      {
        code: "aru",
        outfitName: "아루",
      },
      {
        code: "ch0084",
        outfitName: "아루(새해)",
      },
    ],
    currentOutfitCode: "aru",
    school: "Gehenna",
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
