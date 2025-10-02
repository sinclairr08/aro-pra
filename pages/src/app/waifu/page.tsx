"use client";

import "@/app/globals.css";
import { useApi } from "@/lib/useApi";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import Image from "next/image";
import { Student } from "@/types/waifu";
import { DropZone } from "@/components/waifu/DropZone";
import { useDragAndDrop } from "@/lib/useDragAndDrop";
import { useZoneManagement } from "@/lib/useZoneManagement";
import { useFileOperations } from "@/lib/useFileOperations";
import { defaultStudents } from "@/constants/defaultValues";
import { ContentLayout } from "@/components/layout/ContentLayout";

export default function WaifuPage() {
  const { data: groupedStudents } = useApi<Student[]>({
    apiUrl: "/api/v1/students/grouped/kr",
    defaultValue: defaultStudents,
  });

  const { zones, setZones, handleStudentUpdate } = useZoneManagement({
    groupedStudents,
  });

  const {
    sensors,
    activePreview,
    customCollisionDetection,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDrop({ setZones });

  const { fileInputRef, downloadZones, uploadZones, handleUploadClick } =
    useFileOperations({ zones, setZones });

  return (
    <ContentLayout title="애정도 순위">
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4 max-w-6xl mx-auto">
          <DropZone
            zoneName="rankZone"
            title="랭킹"
            students={zones.rankZone}
            onStudentUpdate={handleStudentUpdate}
          />
          <DropZone
            zoneName="holdZone"
            title="대기"
            students={zones.holdZone}
            onStudentUpdate={handleStudentUpdate}
          />
          <DropZone
            zoneName="excludeZone"
            title="제외"
            students={zones.excludeZone}
            onStudentUpdate={handleStudentUpdate}
          />
        </div>
        <div className="text-center text-sm text-gray-600 mt-6">
          tip: 우클릭으로 학생 일러 변경 가능
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={downloadZones}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            다운로드
          </button>
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            업로드
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            초기화
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={uploadZones}
            className="hidden"
          />
        </div>
        <DragOverlay dropAnimation={null}>
          {activePreview ? (
            <Image
              src={`/imgs/students/${activePreview.code}.png`}
              alt={activePreview.outfitName}
              width={48}
              height={48}
              className="mx-auto mb-6"
              draggable={false}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </ContentLayout>
  );
}
