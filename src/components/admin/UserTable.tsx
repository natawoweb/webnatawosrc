
import { type Database } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface UserTableProps {
  users: (Profile & { role: AppRole })[];
  isLoading: boolean;
  onDelete: (user: Profile & { role: AppRole }) => void;
  onEdit: (user: Profile & { role: AppRole }) => void;
  isAdmin: boolean;
}

export function UserTable({ 
  users = [], // Provide default empty array
  isLoading, 
  onDelete, 
  onEdit,
  isAdmin 
}: UserTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [featuredWriters, setFeaturedWriters] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchFeaturedStatus = async () => {
      try {
        // Ensure users array exists and has items
        if (!users || users.length === 0) return;

        // Get IDs of writer-type users
        const writerIds = users
          .filter(user => user && user.user_type === 'writer')
          .map(user => user.id);

        if (writerIds.length === 0) return;

        const { data, error } = await supabase
          .from('writers')
          .select('id, featured')
          .in('id', writerIds);

        if (error) throw error;

        const featuredStatus = (data || []).reduce((acc, writer) => {
          acc[writer.id] = writer.featured || false;
          return acc;
        }, {} as { [key: string]: boolean });

        setFeaturedWriters(featuredStatus);
      } catch (error) {
        console.error('Error fetching featured status:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch featured writers status"
        });
      }
    };

    fetchFeaturedStatus();
  }, [users, toast]);

  const handleFeatureWriter = async (user: Profile & { role: AppRole }) => {
    try {
      // First check if writer exists in writers table
      const { data: existingWriter } = await supabase
        .from('writers')
        .select('id, featured')
        .eq('id', user.id)
        .single();

      const newFeaturedStatus = !(existingWriter?.featured || false);
      
      const updateData = {
        featured: newFeaturedStatus,
        featured_month: newFeaturedStatus ? new Date().toISOString().substring(0, 7) : null
      };

      // If writer doesn't exist, we need to create the record first
      if (!existingWriter) {
        const { error: insertError } = await supabase
          .from('writers')
          .insert([{
            id: user.id,
            name: user.full_name || user.pseudonym || user.email,
            bio: user.bio || '',
            genre: 'General',
            ...updateData
          }]);

        if (insertError) throw insertError;
      } else {
        // Update existing writer
        const { error: updateError } = await supabase
          .from('writers')
          .update(updateData)
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

      // Update local state
      setFeaturedWriters(prev => ({
        ...prev,
        [user.id]: newFeaturedStatus
      }));

      toast({
        title: "Success",
        description: newFeaturedStatus 
          ? "Writer has been featured for this month"
          : "Writer has been unfeatured",
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update featured status"
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.full_name || 'N/A'}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {new Date(user.created_at || "").toLocaleDateString()}
            </TableCell>
            <TableCell className="capitalize">{user.role}</TableCell>
            <TableCell>
              {user.level ? (
                <Badge variant="secondary">{user.level}</Badge>
              ) : (
                <span className="text-muted-foreground text-sm">Not set</span>
              )}
            </TableCell>
            <TableCell>
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
                    onClick={() => handleFeatureWriter(user)}
                  >
                    <Star 
                      className={`h-4 w-4 ${
                        featuredWriters[user.id] ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
