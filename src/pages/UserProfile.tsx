
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ChevronLeft, Loader2, Pencil, Upload, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

      // If no profile exists, create one with default values
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

      // Delete old avatar if exists
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
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
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="text-center relative">
          <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 ring-2 ring-primary/10">
                <AvatarImage 
                  src={profile?.avatar_url} 
                  alt={profile?.full_name} 
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
                    onChange={uploadAvatar}
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

            {isEditing ? (
              <form onSubmit={updateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={editedProfile?.full_name || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pseudonym">Pseudonym</Label>
                  <Input
                    id="pseudonym"
                    type="text"
                    value={editedProfile?.pseudonym || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, pseudonym: e.target.value })}
                    placeholder="Enter your pseudonym"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={editedProfile?.date_of_birth || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, date_of_birth: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={editedProfile?.gender || ''}
                    onValueChange={(value) => setEditedProfile({ ...editedProfile, gender: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editedProfile?.bio || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Social Media Links</Label>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        type="url"
                        value={editedProfile?.social_links?.twitter || ''}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        type="url"
                        value={editedProfile?.social_links?.facebook || ''}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        type="url"
                        value={editedProfile?.social_links?.instagram || ''}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={editedProfile?.social_links?.linkedin || ''}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Update Profile
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="mt-1">{profile?.full_name || 'Not set'}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Pseudonym</Label>
                  <p className="mt-1">{profile?.pseudonym || 'Not set'}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Date of Birth</Label>
                  <p className="mt-1">{profile?.date_of_birth || 'Not set'}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Gender</Label>
                  <p className="mt-1">{profile?.gender || 'Not set'}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Bio</Label>
                  <p className="mt-1">{profile?.bio || 'No bio available'}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Social Media</Label>
                  <div className="mt-2 space-y-2">
                    {profile?.social_links?.twitter && (
                      <p>Twitter: {profile.social_links.twitter}</p>
                    )}
                    {profile?.social_links?.facebook && (
                      <p>Facebook: {profile.social_links.facebook}</p>
                    )}
                    {profile?.social_links?.instagram && (
                      <p>Instagram: {profile.social_links.instagram}</p>
                    )}
                    {profile?.social_links?.linkedin && (
                      <p>LinkedIn: {profile.social_links.linkedin}</p>
                    )}
                    {!profile?.social_links || Object.keys(profile.social_links).length === 0 && (
                      <p className="text-muted-foreground">No social media links added</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
