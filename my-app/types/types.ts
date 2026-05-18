export interface Cat {
  name: string;
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
  audit: {
    action: string;
    timestamp: string;
  }[];
}
