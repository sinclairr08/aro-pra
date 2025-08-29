"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
  items: StudentRankingItemProps[];
  onItemMove: (
    student: StudentRankingItemProps,
    fromZone: keyof StudentRankingZones,
    toZone: keyof StudentRankingZones,
  ) => void;
  isGrid?: boolean;
  onStudentUpdate: (groupName: string, newIdx: number) => void;
}

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
}

const DraggableStudent: React.FC<DraggableStudentProps> = ({
  student,
  rank,
  zone,
  onStudentUpdate,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "STUDENT",
    item: { student, sourceZone: zone },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

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
        ref={drag as any}
        className={`rounded p-2 cursor-move ${isDragging ? "opacity-50" : ""} ${zone === "rankZone" ? "mb-2" : ""}`}
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
              className="mx-auto mb-6"
            />
            <span className="text-lg mr-2">{student.groupName}</span>
          </div>
        ) : (
          <div className="text-center">
            <Image
              src={`/imgs/${displayStudent.code}.png`}
              alt={displayStudent.name}
              width={48}
              height={48}
              className="mx-auto mb-6"
            />
          </div>
        )}
      </div>
      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-gray-300 rounded shadow-lg z-50 py-1"
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
  items,
  onItemMove,
  isGrid,
  onStudentUpdate,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "STUDENT",
    drop: (dragStudent: {
      student: StudentRankingItemProps;
      sourceZone: keyof StudentRankingZones;
    }) => {
      if (dragStudent.sourceZone !== zoneName) {
        onItemMove(dragStudent.student, dragStudent.sourceZone, zoneName);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as any} // 🔧 타입 에러 해결
      className={`bg-white rounded-lg shadow p-4 min-h-64 border-2 border-dashed ${
        isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <h3 className="font-bold text-center mb-4">{title}</h3>
      <div className={isGrid ? "grid grid-cols-4 gap-1" : "space-y-2"}>
        {items.length === 0 ? (
          <div className="text-gray-400 text-center py-8 text-sm">
            드래그하세요
          </div>
        ) : (
          items.map((item, index) => (
            <DraggableStudent
              key={item.groupName}
              student={item}
              zone={zoneName}
              rank={zoneName === "rankZone" ? index + 1 : undefined}
              onStudentUpdate={onStudentUpdate}
            />
          ))
        )}
      </div>
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
        excludeZone: groupedStudents,
      }));
    }
  }, [groupedStudents]);

  const moveItem = (
    item: StudentRankingItemProps,
    fromZone: keyof StudentRankingZones,
    toZone: keyof StudentRankingZones,
  ) => {
    setZones((prev) => ({
      ...prev,
      [fromZone]: prev[fromZone].filter((i) => i.groupName !== item.groupName),
      [toZone]: [...prev[toZone], item],
    }));
  };

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-100 min-h-screen p-6">
        <h1 className="text-2xl font-bold text-center mb-6">드래그 앤 드롭</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <DropZone
            zoneName="rankZone"
            title="랭킹"
            items={zones.rankZone}
            onItemMove={moveItem}
            onStudentUpdate={handleStudentUpdate}
          />
          <DropZone
            zoneName="holdZone"
            title="대기"
            items={zones.holdZone}
            onItemMove={moveItem}
            onStudentUpdate={handleStudentUpdate}
            isGrid
          />
          <DropZone
            zoneName="excludeZone"
            title="제외"
            items={zones.excludeZone}
            onItemMove={moveItem}
            onStudentUpdate={handleStudentUpdate}
            isGrid
          />
        </div>
      </div>
    </DndProvider>
  );
}
