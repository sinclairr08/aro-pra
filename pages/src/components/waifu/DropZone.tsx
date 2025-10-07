import { DropStudentZoneProps } from "@/types/waifu";
import { useDroppable } from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DraggableStudent } from "@/components/waifu/DraggableStudent";

export const DropZone: React.FC<DropStudentZoneProps> = ({
  zoneName,
  title,
  students,
  onStudentUpdate,
}) => {
  const sortableStudents = students.map(
    (student) => `${zoneName}-${student.name}`,
  );

  const { setNodeRef } = useDroppable({ id: zoneName });

  return (
    <div
      ref={setNodeRef}
      className="bg-white shadow min-h-28 flex items-stretch gap-0"
    >
      {title && (
        <div className="bg-gray-100 px-3 flex items-center justify-center">
          <h3 className="font-bold text-lg whitespace-nowrap">{title}</h3>
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
                  key={`${zoneName}-${item.name}`}
                  student={item}
                  zone={zoneName}
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
