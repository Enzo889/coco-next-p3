export interface User {
  id: number;
  email: string;
  name: string;
  group: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  group: number;
  name: string;
  id: number;
}
