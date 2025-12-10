export interface StudentOutfit {
  code: string;
  outfitName: string;
}

export interface Student {
  name: string;
  outfits: StudentOutfit[];
  currentOutfitCode: string;
  school: string;
}

export interface RankZone {
  id: string;
  title: string;
  students: Student[];
  backgroundColor?: string;
}

export interface StudentZones {
  rankZones: RankZone[];
  holdZone: Student[];
}

export interface DraggableStudentProps {
  student: Student;
  zoneId: string;
  onStudentUpdate: (name: string, outfitCode: string) => void;
}

export interface DropStudentZoneProps {
  zoneId: string;
  title?: string;
  students: Student[];
  onStudentUpdate: (name: string, outfitCode: string) => void;
  onTitleChange?: (zoneId: string, newTitle: string) => void;
  onDeleteZone?: (zoneId: string) => void;
  onMoveZone?: (zoneId: string, direction: "up" | "down") => void;
  onBackgroundColorChange?: (zoneId: string, newColor: string) => void;
  backgroundColor?: string;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  openColorPickerId?: string | null;
  setOpenColorPickerId?: (id: string | null) => void;
}
