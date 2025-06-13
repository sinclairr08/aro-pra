export interface VersionCardProps {
  id: string;
  version: string;
  updatedDate: string;
  description: string[];
}

export interface VersionRequest {
  version: string;
  updatedDate: string;
  description: string[];
}
