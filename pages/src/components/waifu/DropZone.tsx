import { DropStudentZoneProps } from "@/types/waifu";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { DraggableStudent } from "@/components/waifu/DraggableStudent";
import { useState } from "react";

export const DropZone: React.FC<DropStudentZoneProps> = ({
  zoneId,
  title,
  students,
  onStudentUpdate,
  onTitleChange,
  onDeleteZone,
  onMoveZone,
  onBackgroundColorChange,
  backgroundColor,
  canMoveUp,
  canMoveDown,
  openColorPickerId,
  setOpenColorPickerId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title || "");

  const showColorPicker = openColorPickerId === zoneId;

  const sortableStudents = students.map(
    (student) => `${zoneId}-${student.name}`,
  );

  const { setNodeRef } = useDroppable({ id: zoneId });

  const handleTitleDoubleClick = () => {
    if (onTitleChange) {
      setIsEditing(true);
    }
  };

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (onTitleChange && editedTitle.trim()) {
      onTitleChange(zoneId, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setEditedTitle(title || "");
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (
      onDeleteZone &&
      confirm(
        `"${title}" 랭킹을 삭제하시겠습니까? 안에 있는 학생들은 대기 구역으로 이동합니다.`,
      )
    ) {
      onDeleteZone(zoneId);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onBackgroundColorChange) {
      onBackgroundColorChange(zoneId, e.target.value);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-white shadow min-h-28 flex items-stretch gap-0"
    >
      {title !== undefined && (
        <div
          className="w-28 pl-3 pr-1 flex items-center justify-center gap-1 relative flex-shrink-0 group"
          style={{ backgroundColor: backgroundColor || "#fce7f3" }}
        >
          {onMoveZone && (
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => onMoveZone(zoneId, "up")}
                disabled={!canMoveUp}
                className={`text-xs ${canMoveUp ? "text-gray-600 hover:text-gray-800" : "text-gray-300 cursor-not-allowed"}`}
                title="위로 이동"
              >
                ▲
              </button>
              <button
                onClick={() => onMoveZone(zoneId, "down")}
                disabled={!canMoveDown}
                className={`text-xs ${canMoveDown ? "text-gray-600 hover:text-gray-800" : "text-gray-300 cursor-not-allowed"}`}
                title="아래로 이동"
              >
                ▼
              </button>
            </div>
          )}
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={handleTitleInputChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="font-medium text-sm px-2 py-1 border border-gray-300 rounded w-20"
              autoFocus
            />
          ) : (
            <>
              <h3
                className="font-medium text-sm text-slate-500 whitespace-nowrap cursor-pointer"
                onDoubleClick={handleTitleDoubleClick}
                title="더블클릭하여 수정"
              >
                {title}
              </h3>
              <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {onBackgroundColorChange && setOpenColorPickerId && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenColorPickerId(showColorPicker ? null : zoneId)
                      }
                      className="text-xs"
                      title="배경색 변경"
                    >
                      💧
                    </button>
                    {showColorPicker && (
                      <div className="absolute top-6 left-0 z-10 bg-white p-2 shadow-lg rounded border border-gray-300">
                        <input
                          type="color"
                          value={backgroundColor || "#fce7f3"}
                          onChange={handleColorChange}
                          className="w-8 h-8 cursor-pointer"
                        />
                        <button
                          onClick={() => setOpenColorPickerId(null)}
                          className="mt-1 text-xs text-gray-500 hover:text-gray-700 w-full"
                        >
                          닫기
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {onDeleteZone && (
                  <button
                    onClick={handleDelete}
                    className="text-red-400 hover:text-red-600 text-xs"
                    title="삭제"
                  >
                    ✕
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
      <div className="flex-1 px-2 flex items-center">
        <SortableContext
          items={sortableStudents}
          strategy={rectSortingStrategy}
        >
          {students.length === 0 ? (
            <div className="text-gray-400 text-center py-4 text-sm w-full">
              드래그하세요
            </div>
          ) : (
            <div className="flex flex-wrap gap-0 justify-start">
              {students.map((item) => (
                <DraggableStudent
                  key={`${zoneId}-${item.name}`}
                  student={item}
                  zoneId={zoneId}
                  onStudentUpdate={onStudentUpdate}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
