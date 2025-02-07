
import { useLocation, Navigate } from "react-router-dom";
import { AdminUserProfileView } from "@/components/admin/AdminUserProfileView";
import { type UserWithRole } from "@/types/user-management";

export default function AdminUserProfile() {
  const location = useLocation();
  const user = location.state?.user as UserWithRole;

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return <AdminUserProfileView profile={user} />;
}
