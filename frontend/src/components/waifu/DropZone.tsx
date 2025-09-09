import { DropStudentZoneProps } from "@/types/waifu";
import { useDroppable } from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableStudent } from "@/components/waifu/DraggableStudent";

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
                key={`${zoneName}-${item.name}`}
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
