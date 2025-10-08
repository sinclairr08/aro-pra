import { useCallback, useEffect, useState } from "react";
import { Student, StudentZones } from "@/types/waifu";

interface UseZoneManagementProps {
  groupedStudents?: Student[];
}

const STORAGE_KEY = "waifu-zones";

const validateAndMigrateZones = (parsedZones: any): StudentZones | null => {
  if (!parsedZones.rankZones || !Array.isArray(parsedZones.rankZones)) {
    return null;
  }
  return parsedZones as StudentZones;
};

export const useZoneManagement = ({
  groupedStudents,
}: UseZoneManagementProps) => {
  const [zones, setZones] = useState<StudentZones>({
    rankZones: [
      {
        id: "rank-1",
        title: "title-1",
        students: [],
      },
    ],
    holdZone: [],
  });

  const syncZone = (studentData: Student[], currentZones: StudentZones) => {
    const studentDataMap = new Map(
      studentData.map((student) => [student.name, student]),
    );

    const existingNames = new Set<string>();
    const newZones: StudentZones = {
      rankZones: (currentZones.rankZones || []).map((rankZone) => ({
        ...rankZone,
        students: rankZone.students.map((oldStudent: Student) => {
          existingNames.add(oldStudent.name);
          const updatedStudent = studentDataMap.get(oldStudent.name);
          return updatedStudent
            ? { ...oldStudent, outfits: updatedStudent.outfits }
            : oldStudent;
        }),
      })),
      holdZone: (currentZones.holdZone || []).map((oldStudent: Student) => {
        existingNames.add(oldStudent.name);
        const updatedStudent = studentDataMap.get(oldStudent.name);
        return updatedStudent
          ? { ...oldStudent, outfits: updatedStudent.outfits }
          : oldStudent;
      }),
    };

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
        const validated = validateAndMigrateZones(parsedZones);

        if (!validated) {
          console.warn("Invalid zone structure detected, resetting to default");
          localStorage.removeItem(STORAGE_KEY);
          currentZones = {
            rankZones: [{ id: "rank-1", title: "title-1", students: [] }],
            holdZone: [],
          };
        } else {
          setZones(validated);
          currentZones = validated;
        }
      } catch (error) {
        console.error("Failed to parse saved zones:", error);
        localStorage.removeItem(STORAGE_KEY);
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
        const newZones: StudentZones = {
          rankZones: prev.rankZones.map((rankZone) => ({
            ...rankZone,
            students: rankZone.students.map((student) =>
              student.name === name
                ? { ...student, currentOutfitCode: outfitCode }
                : student,
            ),
          })),
          holdZone: prev.holdZone.map((student) =>
            student.name === name
              ? { ...student, currentOutfitCode: outfitCode }
              : student,
          ),
        };

        return newZones;
      });
    },
    [],
  );

  const handleAddZone = useCallback(() => {
    setZones((prev) => {
      const maxNum = prev.rankZones.reduce((max, zone) => {
        const match = zone.title.match(/^title-(\d+)$/);
        return match ? Math.max(max, parseInt(match[1])) : max;
      }, 0);

      return {
        ...prev,
        rankZones: [
          ...prev.rankZones,
          {
            id: `rank-${Date.now()}`,
            title: `title-${maxNum + 1}`,
            students: [],
          },
        ],
      };
    });
  }, []);

  const handleDeleteZone = useCallback((zoneId: string) => {
    setZones((prev) => {
      const zoneToDelete = prev.rankZones.find((z) => z.id === zoneId);
      if (!zoneToDelete) return prev;

      return {
        ...prev,
        rankZones: prev.rankZones.filter((z) => z.id !== zoneId),
        holdZone: [...prev.holdZone, ...zoneToDelete.students],
      };
    });
  }, []);

  const handleTitleChange = useCallback((zoneId: string, newTitle: string) => {
    setZones((prev) => ({
      ...prev,
      rankZones: prev.rankZones.map((zone) =>
        zone.id === zoneId ? { ...zone, title: newTitle } : zone,
      ),
    }));
  }, []);

  const handleMoveZone = useCallback(
    (zoneId: string, direction: "up" | "down") => {
      setZones((prev) => {
        const index = prev.rankZones.findIndex((z) => z.id === zoneId);
        if (index === -1) return prev;

        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= prev.rankZones.length) return prev;

        const newRankZones = [...prev.rankZones];
        [newRankZones[index], newRankZones[newIndex]] = [
          newRankZones[newIndex],
          newRankZones[index],
        ];

        return {
          ...prev,
          rankZones: newRankZones,
        };
      });
    },
    [],
  );

  const handleBackgroundColorChange = useCallback(
    (zoneId: string, newColor: string) => {
      setZones((prev) => ({
        ...prev,
        rankZones: prev.rankZones.map((zone) =>
          zone.id === zoneId ? { ...zone, backgroundColor: newColor } : zone,
        ),
      }));
    },
    [],
  );

  return {
    zones,
    setZones,
    handleStudentUpdate,
    handleAddZone,
    handleDeleteZone,
    handleTitleChange,
    handleMoveZone,
    handleBackgroundColorChange,
  };
};
