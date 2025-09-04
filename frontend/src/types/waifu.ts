export interface StudentOutfit {
  code: string;
  name: string;
}

export interface Student {
  groupName: string;
  value: StudentOutfit[];
  currentIdx?: number;
}

export interface StudentZones {
  rankZone: Student[];
  holdZone: Student[];
  excludeZone: Student[];
}

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
