import { Role } from './role.model';

export interface User {
  user_id: number;
  name: string;
  email: string;
  register_date?: string;
  last_access?: string | null;
  status: 'active' | 'banned';
  roles?: Role[];
}
