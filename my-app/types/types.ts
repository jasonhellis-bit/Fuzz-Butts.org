export interface Cat {
  name: string;
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  title?: string | null;
  status: UserStatus;
  roles: string;
  created_at: string;
  updated_at: string;
  email?: string;  // joined from auth.users
  phone?: string;  // joined from auth.users
  audit?: {
    id: string;
    description: string;
    event_date_time: string;
  }[];
}
