import { useCallback, useEffect, useState } from "react";
import { Student, StudentZones } from "@/types/waifu";

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
    excludeZone: [],
  });

  useEffect(() => {
    const savedZones = localStorage.getItem(STORAGE_KEY);
    if (savedZones) {
      try {
        const parsedZones = JSON.parse(savedZones);
        setZones(parsedZones);
        return;
      } catch (error) {
        console.error("Failed to parse saved zones:", error);
      }
    }

    if (groupedStudents && groupedStudents.length > 0) {
      setZones((prev) => ({
        ...prev,
        holdZone: groupedStudents,
      }));
    }
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
