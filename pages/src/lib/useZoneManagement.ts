import { useCallback, useEffect, useState } from "react";
import { Student, StudentZoneKeys, StudentZones } from "@/types/waifu";

interface UseZoneManagementProps {
  groupedStudents?: Student[];
}

const STORAGE_KEY = "waifu-zones";

export const useZoneManagement = ({
  groupedStudents,
}: UseZoneManagementProps) => {
  const [zones, setZones] = useState<StudentZones>({
    rankZone: [],
    holdZone: [],
  });

  const syncZone = (studentData: Student[], currentZones: StudentZones) => {
    const studentDataMap = new Map(
      studentData.map((student) => [student.name, student]),
    );

    const existingNames = new Set<string>();
    const newZones: StudentZones = {
      rankZone: [],
      holdZone: [],
    };

    Object.entries(currentZones).forEach(([zoneKey, students]) => {
      const zone = zoneKey as StudentZoneKeys;
      newZones[zone] = students.map((oldStudent: Student) => {
        existingNames.add(oldStudent.name);
        const updatedStudent = studentDataMap.get(oldStudent.name);
        return updatedStudent
          ? { ...oldStudent, outfits: updatedStudent.outfits }
          : oldStudent;
      });
    });

    const newStudents = studentData.filter(
      (student) => !existingNames.has(student.name),
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
    (name: string, outfitCode: string): void => {
      setZones((prev) => {
        const newZones = { ...prev };

        Object.keys(newZones).forEach((zoneKey) => {
          const zone = zoneKey as keyof StudentZones;
          newZones[zone] = newZones[zone].map((student) =>
            student.name === name
              ? { ...student, currentOutfitCode: outfitCode }
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
