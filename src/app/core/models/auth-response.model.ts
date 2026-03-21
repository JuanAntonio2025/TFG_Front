import { User } from './user.model';

export interface AuthResponse {
  message: string;
  token: string;
  token_type: string;
  user: User;
}
