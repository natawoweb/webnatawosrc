
import { type Database } from "@/integrations/supabase/types";
import type { UserLevel } from "@/integrations/supabase/types/models";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type AppRole = Database['public']['Enums']['app_role'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];

export type UserWithRole = Profile & {
  role: AppRole;
};

export interface AddUserParams {
  email: string;
  fullName: string;
  role: AppRole;
  password: string;
  level: UserLevel;
}

