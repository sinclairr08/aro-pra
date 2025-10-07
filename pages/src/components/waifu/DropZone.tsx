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
  canMoveUp,
  canMoveDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title || "");

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

  return (
    <div
      ref={setNodeRef}
      className="bg-white shadow min-h-28 flex items-stretch gap-0"
    >
      {title !== undefined && (
        <div className="bg-gray-100 w-32 px-3 flex items-center justify-center gap-2 relative flex-shrink-0">
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
              {onDeleteZone && (
                <button
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-600 text-xs"
                  title="삭제"
                >
                  ✕
                </button>
              )}
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
