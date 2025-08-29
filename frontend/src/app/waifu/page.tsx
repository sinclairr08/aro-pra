"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface StudentInfo {
  code: string;
  name: string;
}

interface StudentRankingItemProps {
  groupName: string;
  value: StudentInfo[];
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
}

const DraggableStudent: React.FC<DraggableStudentProps> = ({
  student,
  rank,
  zone,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "STUDENT",
    item: { student, sourceZone: zone },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={drag as any}
      className={`rounded p-2 cursor-move ${isDragging ? "opacity-50" : ""} ${zone === "rankZone" ? "mb-2" : ""}`}
    >
      {zone === "rankZone" ? (
        <div className="flex items-center">
          <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs mr-2">
            {rank}
          </span>
          <span className="text-lg mr-2">{student.groupName}</span>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-lg mr-2">{student.groupName}</span>
        </div>
      )}
    </div>
  );
};

const DropZone: React.FC<DropStudentZoneProps> = ({
  zoneName,
  title,
  items,
  onItemMove,
  isGrid,
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
      <div className={isGrid ? "grid grid-cols-2 gap-2" : "space-y-2"}>
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
            />
          ))
        )}
      </div>
    </div>
  );
};

export default function WaifuPage() {
  const { data: groupedStudents, loading } = useApi<StudentRankingItemProps[]>({
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
          />
          <DropZone
            zoneName="holdZone"
            title="대기"
            items={zones.holdZone}
            onItemMove={moveItem}
            isGrid
          />
          <DropZone
            zoneName="excludeZone"
            title="제외"
            items={zones.excludeZone}
            onItemMove={moveItem}
            isGrid
          />
        </div>
      </div>
    </DndProvider>
  );
}
