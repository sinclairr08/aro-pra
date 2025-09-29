import { Student, StudentOutfit } from "@/types/waifu";

export const getCurrentOutfit = (
  student: Student,
): StudentOutfit | undefined => {
  if (!student.outfits || student.outfits.length === 0) {
    return undefined;
  }

  if (!student.currentOutfitCode) {
    return student.outfits[0];
  }

  return (
    student.outfits.find(
      (outfit) => outfit.code === student.currentOutfitCode,
    ) || student.outfits[0]
  );
};
