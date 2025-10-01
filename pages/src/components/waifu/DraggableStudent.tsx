import { DraggableStudentProps, StudentOutfit } from "@/types/waifu";
import { getCurrentOutfit } from "@/lib/studentUtils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StudentContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
}

interface StudentImageProps {
  outfit: StudentOutfit;
  size: number;
  gray?: boolean;
  additionalStyle?: string;
}

const StudentImage = ({
  outfit,
  size,
  gray,
  additionalStyle,
}: StudentImageProps) => {
  return (
    <Image
      src={`/imgs/students/${outfit.code}.png`}
      alt={outfit.outfitName}
      width={size}
      height={size}
      className={`${gray ? "grayscale" : ""} ${additionalStyle || ""}`}
    />
  );
};

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
    id: `${zone}-${student.name}`,
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
    if (!student.outfits || student.outfits.length === 0) return;

    const selectedOutfit = student.outfits[index];
    if (selectedOutfit) {
      onStudentUpdate(student.name, selectedOutfit.code);
    }
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

  const displayOutfit = getCurrentOutfit(student);

  if (!displayOutfit) {
    return (
      <div className="relative w-20 h-28 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-xs">No outfit</span>
      </div>
    );
  }

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
            <StudentImage
              outfit={displayOutfit}
              size={64}
              additionalStyle="w-16 h-16 object-contain"
            />
            <span className="min-w-0 truncate text-base leading-tight">
              {student.name}
            </span>
          </div>
        ) : (
          <div className="text-center">
            <StudentImage
              outfit={displayOutfit}
              size={80}
              gray={zone === "excludeZone"}
              additionalStyle="mx-auto"
            />
          </div>
        )}
      </div>
      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-gray-300 rounded shadow-lg z-50 context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {student.outfits.map((outfit, index) => (
            <button
              key={outfit.code}
              className="block w-full hover:bg-gray-100"
              onClick={() => handleContextMenuSelect(index)}
            >
              <StudentImage
                outfit={outfit}
                size={48}
                additionalStyle="w-16 h-16 object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
};
