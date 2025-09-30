import { Student, StudentOutfit } from "@/types/waifu";

export const getCurrentOutfit = (
  student: Student,
): StudentOutfit | undefined => {
  if (
    !student.outfits ||
    student.outfits.length === 0 ||
    !student.currentOutfitCode
  ) {
    return undefined;
  }

  return student.outfits.find(
    (outfit) => outfit.code === student.currentOutfitCode,
  );
};
