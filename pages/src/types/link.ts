export interface LinkCardProps {
  id: string;
  name: string;
  url: string;
  section: string;
}

export interface LinkRequest {
  name: string;
  url: string;
}

export interface SimpleLinkCardProps {
  id: string | number;
  name: string;
  location: string;
}
