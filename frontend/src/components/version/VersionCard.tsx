import { VersionCardProps } from "@/types/versionCard";

export const VersionCard: React.FC<VersionCardProps> = ({
  version,
  updatedDate,
  description,
}) => {
  return (
    <div className="block p-4 rounded-lg border transition-all duration-200 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm font-semibold text-gray-800">{version}</div>
        <div className="text-xs text-gray-500">{updatedDate}</div>
      </div>
      <div className="border-t border-gray-200 mt-3 pt-3">
        <ul className="list-disc list-inside space-y-1">
          {description.map((item, index) => (
            <li key={index} className="text-sm text-gray-600">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
