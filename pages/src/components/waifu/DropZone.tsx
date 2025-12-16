import { DropStudentZoneProps } from "@/types/waifu";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { DraggableStudent } from "@/components/waifu/DraggableStudent";
import { useEffect, useState } from "react";

const DEFAULT_BACKGROUND_COLOR = "#fce7f3";

const isColorDark = (hexColor: string) => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

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

  useEffect(() => {
    setEditedTitle(title || "");
  }, [title]);

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

  const isSchoolHoldZone = zoneId.startsWith("holdZone-");
  const minHeight = isSchoolHoldZone ? "min-h-16" : "min-h-28";

  return (
    <div
      ref={setNodeRef}
      className={`bg-white shadow ${minHeight} flex items-stretch gap-0`}
    >
      {title !== undefined && (
        <div
          className="w-36 py-2 flex flex-col justify-center relative flex-shrink-0 group"
          style={{
            backgroundColor: backgroundColor || DEFAULT_BACKGROUND_COLOR,
          }}
        >
          {onMoveZone && (
            <div className="flex flex-col gap-0.5 absolute left-2 top-1/2 -translate-y-1/2 opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              {canMoveUp && (
                <button
                  onClick={() => onMoveZone(zoneId, "up")}
                  className="text-xs text-gray-600 hover:text-gray-800 cursor-pointer"
                  title="위로 이동"
                >
                  ▲
                </button>
              )}
              {canMoveDown && (
                <button
                  onClick={() => onMoveZone(zoneId, "down")}
                  className="text-xs text-gray-600 hover:text-gray-800 cursor-pointer"
                  title="아래로 이동"
                >
                  ▼
                </button>
              )}
            </div>
          )}
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={handleTitleInputChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="font-medium text-sm px-2 py-1 border border-gray-300 rounded w-16 mx-auto"
              autoFocus
            />
          ) : (
            <>
              <h3
                className="font-medium text-sm text-center px-6 break-keep leading-tight cursor-pointer"
                style={{
                  color: isColorDark(
                    backgroundColor || DEFAULT_BACKGROUND_COLOR,
                  )
                    ? "#ffffff"
                    : "#334155",
                }}
                onDoubleClick={handleTitleDoubleClick}
                title="더블클릭하여 수정"
              >
                {title}
              </h3>
              <div className="flex flex-col gap-1 opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute right-1 top-1/2 -translate-y-1/2">
                {onTitleChange && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                    title="이름 수정"
                  >
                    ✎
                  </button>
                )}
                {onBackgroundColorChange && setOpenColorPickerId && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenColorPickerId(showColorPicker ? null : zoneId)
                      }
                      className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                      title="배경색 변경"
                    >
                      ◐
                    </button>
                    {showColorPicker && (
                      <div className="absolute top-6 right-0 z-10 bg-white p-2 shadow-lg rounded border border-gray-300">
                        <input
                          type="color"
                          value={backgroundColor || DEFAULT_BACKGROUND_COLOR}
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
                    className="text-sm text-gray-600 hover:text-red-600 cursor-pointer"
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
      <div className="flex-1 px-6 md:px-2 py-2 flex items-center">
        <SortableContext
          items={sortableStudents}
          strategy={rectSortingStrategy}
        >
          {students.length === 0 ? (
            <div className="text-gray-400 text-center py-4 text-sm w-full">
              드래그하세요
            </div>
          ) : (
            <div className="flex flex-wrap gap-0.5 justify-start">
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
