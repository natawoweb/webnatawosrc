import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileView } from "@/components/profile/ProfileView";
import { Loader2 } from "lucide-react";

interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/auth');
        return;
      }

      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        throw error;
      }

      if (!data) {
        const newProfile = {
          id: session.user.id,
          email: session.user.email,
          user_type: 'reader',
          social_links: {},
          gender: null,
          date_of_birth: null,
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) throw insertError;
        data = newProfile;
      }

      setProfile(data);
      setEditedProfile(data);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/auth');
        return;
      }

      const updates = {
        id: session.user.id,
        full_name: editedProfile.full_name,
        bio: editedProfile.bio,
        pseudonym: editedProfile.pseudonym,
        social_links: editedProfile.social_links,
        gender: editedProfile.gender,
        date_of_birth: editedProfile.date_of_birth,
        updated_at: new Date().toISOString(),
        user_type: editedProfile.user_type || 'reader',
        email: session.user.email,
      };

      let { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message || "Please try again later.",
      });
    }
  }

  function handleProfileChange(field: string, value: any) {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  }

  function handleSocialLinkChange(platform: keyof SocialLinks, value: string) {
    setEditedProfile({
      ...editedProfile,
      social_links: {
        ...editedProfile.social_links,
        [platform]: value
      }
    });
  }

  function handleCancel() {
    setEditedProfile(profile);
    setIsEditing(false);
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        throw new Error('Please upload an image file (jpg, jpeg, png, or gif).');
      }

      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;

      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({
        title: "Success",
        description: "Avatar updated successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Error uploading avatar",
        description: error.message || "Please try again later.",
      });
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <ProfileHeader
          isEditing={isEditing}
          onEditClick={() => setIsEditing(true)}
          onBackClick={() => navigate(-1)}
        />
        <CardContent>
          <div className="space-y-8">
            <AvatarUpload
              avatarUrl={profile?.avatar_url}
              fullName={profile?.full_name}
              isEditing={isEditing}
              uploading={uploading}
              onAvatarChange={uploadAvatar}
            />

            {isEditing ? (
              <ProfileForm
                editedProfile={editedProfile}
                onProfileChange={handleProfileChange}
                onSocialLinkChange={handleSocialLinkChange}
                onSubmit={updateProfile}
                onCancel={handleCancel}
              />
            ) : (
              <ProfileView profile={profile} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
