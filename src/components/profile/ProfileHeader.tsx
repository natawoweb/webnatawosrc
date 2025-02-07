
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
  onBackClick: () => void;
}

export function ProfileHeader({ isEditing, onEditClick, onBackClick }: ProfileHeaderProps) {
  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={onBackClick}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <CardHeader className="text-center relative">
        <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onEditClick}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
    </>
  );
}
