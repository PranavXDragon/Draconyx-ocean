export interface IncidentReport {
  id: string;
  latitude: number;
  longitude: number;
  type: 'pollution' | 'wildlife' | 'debris' | 'illegal-activity' | 'weather' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  imageUrl?: string;
}

export interface MapProps {
  reports: IncidentReport[];
}
