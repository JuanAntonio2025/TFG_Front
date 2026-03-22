import { IncidenceMessage } from './message.model';

export interface IncidenceUser {
  user_id: number;
  name: string;
  email?: string;
}

export interface Incidence {
  incidence_id: number;
  user_id: number;
  subject: string;
  type_of_incident: string;
  creation_date: string;
  status: 'active' | 'inactive';
  user?: IncidenceUser | null;
  messages?: IncidenceMessage[];
}
