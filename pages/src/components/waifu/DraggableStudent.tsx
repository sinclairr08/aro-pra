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
  additionalStyle?: string;
}

const StudentImage = ({
  outfit,
  size,
  additionalStyle,
}: StudentImageProps) => {
  return (
    <Image
      src={`/imgs/students/${outfit.code}.png`}
      alt={outfit.outfitName}
      width={size}
      height={size}
      className={additionalStyle || ""}
    />
  );
};

export const DraggableStudent = ({
  student,
  zoneId,
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
    id: `${zoneId}-${student.name}`,
    data: { student, zoneId },
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
        style={{ ...style, touchAction: "none" }}
        {...attributes}
        {...listeners}
        className={`${isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab"}`}
        onContextMenu={handleRightClick}
      >
        <div className="text-center w-13 h-13 md:w-20 md:h-20">
          <StudentImage
            outfit={displayOutfit}
            size={80}
            additionalStyle="w-full h-full object-contain"
          />
        </div>
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
