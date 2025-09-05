import { Student } from "@/types/waifu";
import { LinkCardProps } from "@/types/link";
import { VersionCardProps } from "@/types/version";

export const defaultStudents: Student[] = [
  {
    groupName: "요시미",
    value: [
      {
        code: "CH0220",
        name: "요시미(밴드)",
      },
      {
        code: "Yoshimi",
        name: "요시미",
      },
    ],
  },
  {
    groupName: "시로코",
    value: [
      {
        code: "CH0263",
        name: "시로코*테러",
      },
      {
        code: "Shiroko",
        name: "시로코",
      },
      {
        code: "CH0188",
        name: "시로코(수영복)",
      },
    ],
  },
  {
    groupName: "아루",
    value: [
      {
        code: "CH0240",
        name: "아루(드레스)",
      },
      {
        code: "Aru",
        name: "아루",
      },
      {
        code: "CH0084",
        name: "아루(새해)",
      },
    ],
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
