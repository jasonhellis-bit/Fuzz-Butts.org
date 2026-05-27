export interface Cat {
  name: string;
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
}

export type PetType = 'cat' | 'dog' | 'rabbit' | 'bird' | 'small_animal' | 'reptile' | 'other';
export type PetSex = 'male' | 'female' | 'unknown';
export type IntakeReason = 'stray' | 'owner_surrender' | 'transfer' | 'born_in_care' | 'other';
export type DispositionReason = 'adopted' | 'transferred' | 'returned_to_owner' | 'deceased' | 'euthanized' | 'other';
export type PetStatus = 'quarantined' | 'available for adoption' | 'pending adoption' | 'adopted' | 'deceased' | 'reclaimed by owner';

export interface Pet {
  id: string;
  name: string;
  pet_type: PetType;
  sex: PetSex;
  breed: string | null;
  description: string | null;
  intake_date: string;
  intake_reason: IntakeReason;
  spayed_neutered: boolean;
  spay_neuter_date: string | null;
  disposition_date: string | null;
  disposition_reason: DispositionReason | null;
  status: PetStatus;
  created_at: string;
  updated_at: string;
  primary_image_url?: string | null;
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
