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
import {
  Student,
  StudentOutfit,
  StudentZoneKeys,
  StudentZones,
} from "@/types/waifu";

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
      const idx = data.student.currentIdx ?? 0;
      const disp = data.student.value[idx];
      setActivePreview({ code: disp.code, name: disp.name });
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const activeData = active.data.current;
      if (!activeData) return;

      let targetZone: StudentZoneKeys;
      let isDropOnZone = false;

      if (["rankZone", "holdZone", "excludeZone"].includes(over.id as string)) {
        targetZone = over.id as StudentZoneKeys;
        isDropOnZone = true;
      } else {
        const overData = over.data.current;
        if (!overData) return;

        targetZone = overData.zone as StudentZoneKeys;
        isDropOnZone = false;
      }

      const activeZone = activeData.zone as StudentZoneKeys;

      if (activeZone !== targetZone) {
        setZones((prev) => {
          const activeItems = [...prev[activeZone]];
          const targetItems = [...prev[targetZone]];

          const activeIdx = activeItems.findIndex(
            (item) => item.groupName === activeData.student.groupName,
          );

          if (activeIdx === -1) return prev;

          const [movedItem] = activeItems.splice(activeIdx, 1);

          if (isDropOnZone) {
            targetItems.push(movedItem);
          } else {
            const overIdx = targetItems.findIndex(
              (item) => `${targetZone}-${item.groupName}` === over.id,
            );

            if (overIdx === -1) {
              targetItems.push(movedItem);
            } else {
              targetItems.splice(overIdx, 0, movedItem);
            }
          }

          return {
            ...prev,
            [activeZone]: activeItems,
            [targetZone]: targetItems,
          };
        });
      } else if (!isDropOnZone && active.id !== over.id) {
        setZones((prev) => {
          const items = [...prev[activeZone as StudentZoneKeys]];

          const activeIdx = items.findIndex(
            (item) => `${activeZone}-${item.groupName}` === active.id,
          );

          const overIdx = items.findIndex(
            (item) => `${activeZone}-${item.groupName}` === over.id,
          );

          if (activeIdx !== -1 && overIdx !== -1) {
            const reorderItems = arrayMove(items, activeIdx, overIdx);
            return {
              ...prev,
              [activeZone]: reorderItems,
            };
          }
          return prev;
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
