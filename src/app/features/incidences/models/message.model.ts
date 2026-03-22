export interface IncidenceMessageUser {
  user_id: number;
  name: string;
  email?: string;
}

export interface IncidenceMessage {
  message_id: number;
  incidence_id: number;
  user_id: number;
  message: string;
  sent_date: string;
  user: IncidenceMessageUser | null;
}
