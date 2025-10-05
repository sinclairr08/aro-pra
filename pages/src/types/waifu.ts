export interface StudentOutfit {
  code: string;
  outfitName: string;
}

export interface Student {
  name: string;
  outfits: StudentOutfit[];
  currentOutfitCode: string;
}

export interface StudentZones {
  rankZone: Student[];
  holdZone: Student[];
}

export type StudentZoneKeys = keyof StudentZones;

export interface DraggableStudentProps {
  student: Student;
  zone: keyof StudentZones;
  rank?: number;
  onStudentUpdate: (name: string, outfitCode: string) => void;
}

export interface DropStudentZoneProps {
  zoneName: keyof StudentZones;
  title: string;
  students: Student[];
  onStudentUpdate: (name: string, outfitCode: string) => void;
}
