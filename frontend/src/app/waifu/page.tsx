"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { useEffect, useRef, useState } from "react";
import {
  closestCenter,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Image from "next/image";
import { Student, StudentOutfit, StudentZones } from "@/types/waifu";
import { DropZone } from "@/components/waifu/DropZone";

const defaultStudents: Student[] = [
  {
    groupName: "요시미",
    value: [
      {
        code: "CH0220",
        name: "요시미(밴드)",
      },
      {
        code: "Yoshimi",
        name: "요시미",
      },
    ],
  },
  {
    groupName: "시로코",
    value: [
      {
        code: "CH0263",
        name: "시로코*테러",
      },
      {
        code: "Shiroko",
        name: "시로코",
      },
      {
        code: "CH0188",
        name: "시로코(수영복)",
      },
    ],
  },
  {
    groupName: "아루",
    value: [
      {
        code: "CH0240",
        name: "아루(드레스)",
      },
      {
        code: "Aru",
        name: "아루",
      },
      {
        code: "CH0084",
        name: "아루(새해)",
      },
    ],
  },
];

export default function WaifuPage() {
  const { data: groupedStudents } = useApi<Student[]>({
    apiUrl: "/api/v1/students/grouped/kr",
    defaultValue: defaultStudents,
  });

  const [zones, setZones] = useState<StudentZones>({
    rankZone: [],
    holdZone: [],
    excludeZone: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (groupedStudents && groupedStudents.length > 0) {
      setZones((prev) => ({
        ...prev,
        holdZone: groupedStudents,
      }));
    }
  }, [groupedStudents]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleStudentUpdate = (groupName: string, newIdx: number): void => {
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
  };

  const [activePreview, setActivePreview] = useState<StudentOutfit | null>(
    null,
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current;
    if (!activeData) return;

    let targetZone: keyof StudentZones;
    let isDropOnZone = false;

    if (["rankZone", "holdZone", "excludeZone"].includes(over.id as string)) {
      targetZone = over.id as keyof StudentZones;
      isDropOnZone = true;
    } else {
      const overData = over.data.current;
      if (!overData) return;

      targetZone = overData.zone as keyof StudentZones;
      isDropOnZone = false;
    }

    const activeZone = activeData.zone as keyof StudentZones;

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
        const items = [...prev[activeZone as keyof StudentZones]];

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
  };

  const customCollisionDetection: CollisionDetection = (args) => {
    const byPointer = pointerWithin(args);
    if (byPointer.length) return byPointer;

    const byRect = rectIntersection(args);
    if (byRect.length) return byRect;

    return closestCenter(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as {
      student?: Student;
    } | null;

    if (data?.student) {
      const idx = data.student.currentIdx ?? 0;
      const disp = data.student.value[idx];

      setActivePreview({ code: disp.code, name: disp.name });
    }
  };

  const downloadZones = () => {
    const dataStr = JSON.stringify(zones, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const uploadZones = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const uploadedZones = JSON.parse(result) as StudentZones;
        setZones(uploadedZones);
      } catch (error) {
        alert("파일 형식이 올바르지 않습니다.");
      }
    };
    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragCancel={() => setActivePreview(null)}
      onDragEnd={(e) => {
        handleDragEnd(e);
        setActivePreview(null);
      }}
    >
      <div className="pt-20 pb-20 px-2">
        <h1 className="text-xl font-bold text-center mb-6">애정도 순위</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4 max-w-6xl mx-auto">
          <DropZone
            zoneName="rankZone"
            title="랭킹"
            students={zones.rankZone}
            onStudentUpdate={handleStudentUpdate}
          />
          <DropZone
            zoneName="holdZone"
            title="대기"
            students={zones.holdZone}
            onStudentUpdate={handleStudentUpdate}
          />
          <DropZone
            zoneName="excludeZone"
            title="제외"
            students={zones.excludeZone}
            onStudentUpdate={handleStudentUpdate}
          />
        </div>
        <div className="text-center text-sm text-gray-600 mt-6">
          tip: 우클릭으로 학생 일러 변경 가능
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={downloadZones}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            다운로드
          </button>
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            업로드
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={uploadZones}
            className="hidden"
          />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activePreview ? (
          <Image
            src={`/imgs/${activePreview.code}.png`}
            alt={activePreview.name}
            width={48}
            height={48}
            className="mx-auto mb-6"
            draggable={false}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
