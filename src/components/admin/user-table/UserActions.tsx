
import { Button } from "@/components/ui/button";
import { Eye, Star, Trash2 } from "lucide-react";
import { type Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface UserActionsProps {
  user: Profile & { role: AppRole };
  isAdmin: boolean;
  isFeatured: boolean;
  onEdit: (user: Profile & { role: AppRole }) => void;
  onDelete: (user: Profile & { role: AppRole }) => void;
  onFeature: (user: Profile & { role: AppRole }) => void;
}

export function UserActions({
  user,
  isAdmin,
  isFeatured,
  onEdit,
  onDelete,
  onFeature
}: UserActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(user)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {isAdmin && user.user_type === 'writer' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFeature(user)}
        >
          <Star 
            className={`h-4 w-4 ${
              isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
            }`} 
          />
        </Button>
      )}
      {isAdmin && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(user)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      )}
    </div>
  );
}
