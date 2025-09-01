"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { useEffect, useState } from "react";
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
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

interface StudentInfo {
  code: string;
  name: string;
}

interface StudentRankingItemProps {
  groupName: string;
  value: StudentInfo[];
  currentIdx?: number;
}

const defaultItems: StudentRankingItemProps[] = [
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

interface StudentRankingZones {
  rankZone: StudentRankingItemProps[];
  holdZone: StudentRankingItemProps[];
  excludeZone: StudentRankingItemProps[];
}

interface DraggableStudentProps {
  student: StudentRankingItemProps;
  zone: keyof StudentRankingZones;
  rank?: number;
  onStudentUpdate: (groupName: string, newIdx: number) => void;
}

interface DropStudentZoneProps {
  zoneName: keyof StudentRankingZones;
  title: string;
  students: StudentRankingItemProps[];
  onStudentUpdate: (groupName: string, newIdx: number) => void;
}

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
}

const DraggableStudent = ({
  student,
  zone,
  rank,
  onStudentUpdate,
}: DraggableStudentProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${zone}-${student.groupName}`,
    data: { student, zone },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleContextMenuSelect = (index: number) => {
    onStudentUpdate(student.groupName, index);
    handleContextMenuClose();
  };

  useEffect(() => {
    const handleGlobalClick = () => {
      if (contextMenu.visible) {
        handleContextMenuClose();
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [contextMenu.visible]);

  const displayStudent = student.value[student.currentIdx || 0];

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`${isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab"} ${zone === "rankZone" ? "mb-2" : ""}`}
        onContextMenu={handleRightClick}
      >
        {zone === "rankZone" ? (
          <div className="flex items-center">
            <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs mr-2">
              {rank}
            </span>
            <Image
              src={`/imgs/${displayStudent.code}.png`}
              alt={displayStudent.name}
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
            />
            <span className="min-w-0 truncate text-base leading-tight">
              {student.groupName}
            </span>
          </div>
        ) : (
          <div className="text-center">
            <Image
              src={`/imgs/${displayStudent.code}.png`}
              alt={displayStudent.name}
              width={80}
              height={80}
              className={`mx-auto ${zone === "excludeZone" ? "grayscale" : ""}`}
            />
          </div>
        )}
      </div>
      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-gray-300 rounded shadow-lg z-5 py-1"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {student.value.map((value, index) => (
            <button
              key={value.code}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleContextMenuSelect(index)}
            >
              {value.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const DropZone: React.FC<DropStudentZoneProps> = ({
  zoneName,
  title,
  students,
  onStudentUpdate,
}) => {
  const sortableStudents = students.map(
    (student) => `${zoneName}-${student.groupName}`,
  );

  const { setNodeRef } = useDroppable({ id: zoneName });
  const zoneConfig = {
    rankZone: {
      css: "space-y-2",
      strategy: verticalListSortingStrategy,
    },
    holdZone: {
      css: "grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8",
      strategy: rectSortingStrategy,
    },
    excludeZone: {
      css: "grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8",
      strategy: rectSortingStrategy,
    },
  };

  const currentZoneConfig = zoneConfig[zoneName];

  return (
    <div
      ref={setNodeRef}
      className="bg-white rounded-lg shadow py-4 px-2 min-h-64 border-2 border-dashed border-gray-300"
    >
      <h3 className="font-bold text-center mb-1">{title}</h3>
      <SortableContext
        items={sortableStudents}
        strategy={currentZoneConfig.strategy}
      >
        {students.length === 0 ? (
          <div className="text-gray-400 text-center py-4 text-sm">
            드래그하세요
          </div>
        ) : (
          <div className={currentZoneConfig.css}>
            {students.map((item, index) => (
              <DraggableStudent
                key={`${zoneName}-${item.groupName}`}
                student={item}
                zone={zoneName}
                rank={zoneName === "rankZone" ? index + 1 : undefined}
                onStudentUpdate={onStudentUpdate}
              />
            ))}
          </div>
        )}
      </SortableContext>
    </div>
  );
};

export default function WaifuPage() {
  const { data: groupedStudents } = useApi<StudentRankingItemProps[]>({
    apiUrl: "/api/v1/students/grouped/kr",
    defaultValue: defaultItems,
  });

  const [zones, setZones] = useState<StudentRankingZones>({
    rankZone: [],
    holdZone: [],
    excludeZone: [],
  });

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
        const zone = zoneKey as keyof StudentRankingZones;
        newZones[zone] = newZones[zone].map((student) =>
          student.groupName === groupName
            ? { ...student, currentIdx: newIdx }
            : student,
        );
      });

      return newZones;
    });
  };

  const [activePreview, setActivePreview] = useState<StudentInfo | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current;
    if (!activeData) return;

    let targetZone: keyof StudentRankingZones;
    let isDropOnZone = false;

    if (["rankZone", "holdZone", "excludeZone"].includes(over.id as string)) {
      targetZone = over.id as keyof StudentRankingZones;
      isDropOnZone = true;
    } else {
      const overData = over.data.current;
      if (!overData) return;

      targetZone = overData.zone as keyof StudentRankingZones;
      isDropOnZone = false;
    }

    const activeZone = activeData.zone as keyof StudentRankingZones;

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
        const items = [...prev[activeZone as keyof StudentRankingZones]];

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
      student?: StudentRankingItemProps;
    } | null;

    if (data?.student) {
      const idx = data.student.currentIdx ?? 0;
      const disp = data.student.value[idx];

      setActivePreview({ code: disp.code, name: disp.name });
    }
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
