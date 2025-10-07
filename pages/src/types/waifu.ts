export interface StudentOutfit {
  code: string;
  outfitName: string;
}

export interface Student {
  name: string;
  outfits: StudentOutfit[];
  currentOutfitCode: string;
}

export interface RankZone {
  id: string;
  title: string;
  students: Student[];
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
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}
