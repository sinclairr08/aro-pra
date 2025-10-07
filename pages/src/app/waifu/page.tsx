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

export default function WaifuPage() {
  const { data: groupedStudents } = useApi<Student[]>({
    apiUrl: "/api/v1/students/grouped/kr",
    defaultValue: defaultStudents,
  });

  const {
    zones,
    setZones,
    handleStudentUpdate,
    handleAddZone,
    handleDeleteZone,
    handleTitleChange,
    handleMoveZone,
  } = useZoneManagement({
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
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <div className="pt-20 pb-20 px-2">
        <h1 className="text-xl font-bold text-center mb-6">애정도 순위</h1>
        <div className="flex flex-col gap-4 max-w-6xl mx-auto">
          {zones.rankZones.map((rankZone, index) => (
            <DropZone
              key={rankZone.id}
              zoneId={rankZone.id}
              title={rankZone.title}
              students={rankZone.students}
              onStudentUpdate={handleStudentUpdate}
              onTitleChange={handleTitleChange}
              onDeleteZone={
                zones.rankZones.length > 1 ? handleDeleteZone : undefined
              }
              onMoveZone={handleMoveZone}
              canMoveUp={index > 0}
              canMoveDown={index < zones.rankZones.length - 1}
            />
          ))}
          <div className="flex justify-center">
            <button
              onClick={handleAddZone}
              className="px-3 py-1 text-sm bg-cyan-400 text-white rounded hover:bg-cyan-500 transition-colors"
            >
              + 구역 추가
            </button>
          </div>
          <DropZone
            zoneId="holdZone"
            students={zones.holdZone}
            onStudentUpdate={handleStudentUpdate}
          />
        </div>
        <div className="text-center text-sm text-gray-600 mt-6">
          <div>tip: 우클릭으로 학생 의상 변경 가능</div>
          <div>tip: 제목 더블클릭으로 수정 가능</div>
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
  );
}
