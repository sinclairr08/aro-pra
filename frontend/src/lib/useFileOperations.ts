import { useRef, useCallback } from "react";
import { StudentZones } from "@/types/waifu";

interface UseFileOperationsProps {
  zones: StudentZones;
  setZones: React.Dispatch<React.SetStateAction<StudentZones>>;
}

export const useFileOperations = ({ zones, setZones }: UseFileOperationsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadZones = useCallback(() => {
    const dataStr = JSON.stringify(zones, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [zones]);

  const uploadZones = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const uploadedZones = JSON.parse(result) as StudentZones;
        setZones(uploadedZones);
      } catch (error) {
        alert("파일 형식이 올바르지 않습니다.");
      }
    };
    reader.readAsText(file);
  }, [setZones]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    downloadZones,
    uploadZones,
    handleUploadClick,
  };
};