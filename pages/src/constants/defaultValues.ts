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
  {
    id: "1",
    name: "일섭 공식",
    url: "https://bluearchive.jp",
    section: "공식",
  },
  {
    id: "2",
    name: "한섭 공식",
    url: "https://forum.nexon.com/bluearchive",
    section: "공식",
  },
  {
    id: "3",
    name: "총력전 정보 및 영상 (일본어)",
    url: "https://www.souriki-border.com",
    section: "정보",
  },
];

export const defaultVersionCards: VersionCardProps[] = [
  {
    id: "0",
    version: "v0.0.0",
    updatedDate: "2025-05-04",
    description: ["프로젝트 설정"],
  },
];

export const schoolNames: Record<string, string> = {
  Gehenna: "게헨나",
  Millennium: "밀레니엄",
  Trinity: "트리니티",
  Abydos: "아비도스",
  Shanhaijing: "산해경",
  Hyakkiyako: "백귀야행",
  Arius: "아리우스",
  Highlander: "하이랜더",
  RedWinter: "붉은겨울",
  SRT: "SRT",
  Valkyrie: "발키리",
  WildHunt: "와일드헌트",
  ETC: "기타",
};
