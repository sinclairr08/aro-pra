import { DraggableStudentProps } from "@/types/waifu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StudentContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
}

export const DraggableStudent = ({
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

  const [contextMenu, setContextMenu] = useState<StudentContextMenuProps>({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    document.querySelectorAll(".context-menu").forEach((menu) => {
      (menu as HTMLElement).style.display = "none";
    });

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
          className="fixed bg-white border border-gray-300 rounded shadow-lg z-50 context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {student.value.map((value, index) => (
            <button
              key={value.code}
              className="block w-full hover:bg-gray-100"
              onClick={() => handleContextMenuSelect(index)}
            >
              <Image
                src={`/imgs/${value.code}.png`}
                alt={`context-${value.name}`}
                width={48}
                height={48}
                className="w-16 h-16 object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
};
