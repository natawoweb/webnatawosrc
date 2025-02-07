
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, User } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl?: string;
  fullName?: string;
  isEditing: boolean;
  uploading: boolean;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AvatarUpload({ avatarUrl, fullName, isEditing, uploading, onAvatarChange }: AvatarUploadProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32 ring-2 ring-primary/10">
        <AvatarImage 
          src={avatarUrl} 
          alt={fullName} 
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/5">
          <User className="h-12 w-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      {isEditing && (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            disabled={uploading}
            className="hidden"
            id="avatar-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={uploading}
            className="w-[200px]"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? "Uploading..." : "Change Avatar"}
          </Button>
        </div>
      )}
    </div>
  );
}
