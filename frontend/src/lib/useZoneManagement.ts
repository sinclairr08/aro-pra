import { useCallback, useEffect, useState } from "react";
import { Student, StudentZoneKeys, StudentZones } from "@/types/waifu";

interface UseZoneManagementProps {
  groupedStudents?: Student[];
}

const STORAGE_KEY = "waifu-zones";
const initialZoneState: StudentZones = {
  rankZone: [],
  holdZone: [],
  excludeZone: [],
};

export const useZoneManagement = ({
  groupedStudents,
}: UseZoneManagementProps) => {
  const [zones, setZones] = useState<StudentZones>(initialZoneState);

  const syncZone = (studentData: Student[], currentZones: StudentZones) => {
    const studentDataMap = new Map(
      studentData.map((student) => [student.groupName, student]),
    );

    const existingGroupNames = new Set<string>();
    const newZones: StudentZones = initialZoneState;

    Object.entries(currentZones).forEach(([zoneKey, students]) => {
      const zone = zoneKey as StudentZoneKeys;
      newZones[zone] = students.map((oldStudent: Student) => {
        existingGroupNames.add(oldStudent.groupName);
        const updatedStudent = studentDataMap.get(oldStudent.groupName);
        return updatedStudent
          ? { ...oldStudent, value: updatedStudent.value }
          : oldStudent;
      });
    });

    const newStudents = studentData.filter(
      (student) => !existingGroupNames.has(student.groupName),
    );

    newZones.holdZone.push(...newStudents);
    setZones(newZones);
  };

  const initializeZones = () => {
    const savedZones = localStorage.getItem(STORAGE_KEY);
    let currentZones: StudentZones = zones;

    if (savedZones) {
      try {
        const parsedZones = JSON.parse(savedZones);
        setZones(parsedZones);
        currentZones = parsedZones;
      } catch (error) {
        console.error("Failed to parse saved zones:", error);
      }
    }

    if (groupedStudents && groupedStudents.length > 0) {
      syncZone(groupedStudents, currentZones);
    }
  };

  useEffect(() => {
    initializeZones();
  }, [groupedStudents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
  }, [zones]);

  const handleStudentUpdate = useCallback(
    (groupName: string, newIdx: number): void => {
      setZones((prev) => {
        const newZones = { ...prev };

        Object.keys(newZones).forEach((zoneKey) => {
          const zone = zoneKey as keyof StudentZones;
          newZones[zone] = newZones[zone].map((student) =>
            student.groupName === groupName
              ? { ...student, currentIdx: newIdx }
              : student,
          );
        });

        return newZones;
      });
    },
    [],
  );

  return {
    zones,
    setZones,
    handleStudentUpdate,
  };
};
