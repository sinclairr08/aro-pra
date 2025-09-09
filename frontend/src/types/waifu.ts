export interface StudentOutfit {
  code: string;
  outfitName: string;
}

export interface Student {
  name: string;
  outfits: StudentOutfit[];
  currentOutfitIdx?: number;
}

export interface StudentZones {
  rankZone: Student[];
  holdZone: Student[];
  excludeZone: Student[];
}

export type StudentZoneKeys = keyof StudentZones;

export interface DraggableStudentProps {
  student: Student;
  zone: keyof StudentZones;
  rank?: number;
  onStudentUpdate: (groupName: string, newIdx: number) => void;
}

export interface DropStudentZoneProps {
  zoneName: keyof StudentZones;
  title: string;
  students: Student[];
  onStudentUpdate: (groupName: string, newIdx: number) => void;
}
