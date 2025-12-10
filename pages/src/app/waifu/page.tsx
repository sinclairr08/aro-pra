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
import { useState } from "react";

export default function WaifuPage() {
  const [openColorPickerId, setOpenColorPickerId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: groupedStudents } = useApi<Student[]>({
    apiUrl: "/api/v1/new-students/grouped/kr",
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
    handleBackgroundColorChange,
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

  const filteredHoldZone = zones.holdZone.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
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
              onBackgroundColorChange={handleBackgroundColorChange}
              backgroundColor={rankZone.backgroundColor}
              canMoveUp={index > 0}
              canMoveDown={index < zones.rankZones.length - 1}
              openColorPickerId={openColorPickerId}
              setOpenColorPickerId={setOpenColorPickerId}
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
          <div className="mt-6">
            <input
              type="text"
              placeholder="학생 이름 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
          <DropZone
            zoneId="holdZone"
            students={filteredHoldZone}
            onStudentUpdate={handleStudentUpdate}
          />
        </div>
        <div className="flex justify-center mt-6">
          <div className="text-left text-sm text-gray-600">
            <div>학생 우클릭: 학생 의상 변경</div>
            <div>제목 더블 클릭: 제목 수정</div>
          </div>
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
