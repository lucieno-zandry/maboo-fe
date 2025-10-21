interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  approved_at: string;
  role: "admin" | "manager" | "client";
  image?: string | null;
  address_id?: number | null;
  client_code_id?: number | null;
  created_at: string;
  updated_at: string;
}
