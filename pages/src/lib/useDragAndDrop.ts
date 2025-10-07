import { useCallback, useState } from "react";
import {
  closestCenter,
  CollisionDetection,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Student, StudentOutfit, StudentZones } from "@/types/waifu";
import { getCurrentOutfit } from "@/lib/studentUtils";

interface UseDragAndDropProps {
  setZones: React.Dispatch<React.SetStateAction<StudentZones>>;
}

export const useDragAndDrop = ({ setZones }: UseDragAndDropProps) => {
  const [activePreview, setActivePreview] = useState<StudentOutfit | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const customCollisionDetection: CollisionDetection = (args) => {
    const byPointer = pointerWithin(args);
    if (byPointer.length) return byPointer;

    const byRect = rectIntersection(args);
    if (byRect.length) return byRect;

    return closestCenter(args);
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as {
      student?: Student;
    } | null;

    if (data?.student) {
      const displayOutfit = getCurrentOutfit(data.student);
      if (displayOutfit) {
        setActivePreview({
          code: displayOutfit.code,
          outfitName: displayOutfit.outfitName,
        });
      }
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const activeData = active.data.current;
      if (!activeData) return;

      const activeZoneId = activeData.zoneId as string;
      let targetZoneId: string;
      let isDropOnZone = false;

      // Check if dropping on a zone container
      const overIdStr = over.id as string;
      if (overIdStr === "holdZone" || overIdStr.startsWith("rank-")) {
        targetZoneId = overIdStr;
        isDropOnZone = true;
      } else {
        const overData = over.data.current;
        if (!overData) return;

        targetZoneId = overData.zoneId as string;
        isDropOnZone = false;
      }

      if (activeZoneId !== targetZoneId) {
        // Moving between zones
        setZones((prev) => {
          const newZones = { ...prev };
          let activeItems: Student[];
          let targetItems: Student[];

          // Get active zone items
          if (activeZoneId === "holdZone") {
            activeItems = [...prev.holdZone];
          } else {
            const activeRankZone = prev.rankZones.find(
              (z) => z.id === activeZoneId,
            );
            if (!activeRankZone) return prev;
            activeItems = [...activeRankZone.students];
          }

          // Get target zone items
          if (targetZoneId === "holdZone") {
            targetItems = [...prev.holdZone];
          } else {
            const targetRankZone = prev.rankZones.find(
              (z) => z.id === targetZoneId,
            );
            if (!targetRankZone) return prev;
            targetItems = [...targetRankZone.students];
          }

          const activeIdx = activeItems.findIndex(
            (item) => item.name === activeData.student.name,
          );

          if (activeIdx === -1) return prev;

          const [movedItem] = activeItems.splice(activeIdx, 1);

          if (isDropOnZone) {
            targetItems.push(movedItem);
          } else {
            const overIdx = targetItems.findIndex(
              (item) => `${targetZoneId}-${item.name}` === over.id,
            );

            if (overIdx === -1) {
              targetItems.push(movedItem);
            } else {
              targetItems.splice(overIdx, 0, movedItem);
            }
          }

          // Update zones
          if (activeZoneId === "holdZone") {
            newZones.holdZone = activeItems;
          } else {
            newZones.rankZones = newZones.rankZones.map((z) =>
              z.id === activeZoneId ? { ...z, students: activeItems } : z,
            );
          }

          if (targetZoneId === "holdZone") {
            newZones.holdZone = targetItems;
          } else {
            newZones.rankZones = newZones.rankZones.map((z) =>
              z.id === targetZoneId ? { ...z, students: targetItems } : z,
            );
          }

          return newZones;
        });
      } else if (!isDropOnZone && active.id !== over.id) {
        // Reordering within same zone
        setZones((prev) => {
          const newZones = { ...prev };
          let items: Student[];

          if (activeZoneId === "holdZone") {
            items = [...prev.holdZone];
          } else {
            const rankZone = prev.rankZones.find((z) => z.id === activeZoneId);
            if (!rankZone) return prev;
            items = [...rankZone.students];
          }

          const activeIdx = items.findIndex(
            (item) => `${activeZoneId}-${item.name}` === active.id,
          );

          const overIdx = items.findIndex(
            (item) => `${activeZoneId}-${item.name}` === over.id,
          );

          if (activeIdx !== -1 && overIdx !== -1) {
            const reorderItems = arrayMove(items, activeIdx, overIdx);

            if (activeZoneId === "holdZone") {
              newZones.holdZone = reorderItems;
            } else {
              newZones.rankZones = newZones.rankZones.map((z) =>
                z.id === activeZoneId ? { ...z, students: reorderItems } : z,
              );
            }
          }

          return newZones;
        });
      }

      setActivePreview(null);
    },
    [setZones],
  );

  const handleDragCancel = useCallback(() => {
    setActivePreview(null);
  }, []);

  return {
    sensors,
    customCollisionDetection,
    activePreview,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};
