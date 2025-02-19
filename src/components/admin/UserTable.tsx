
import { type Database } from "@/integrations/supabase/types";
import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserTableHeader } from "./table/UserTableHeader";
import { UserTableRow } from "./table/UserTableRow";

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
  users, 
  isLoading, 
  onDelete, 
  onEdit,
  isAdmin 
}: UserTableProps) {
  const { toast } = useToast();
  const [featuredWriters, setFeaturedWriters] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchFeaturedStatus = async () => {
      try {
        const writerIds = users
          .filter(user => user.user_type === 'writer')
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
        const { error: updateError } = await supabase
          .from('writers')
          .update(updateData)
          .eq('id', user.id);

        if (updateError) throw updateError;
      }

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
      <UserTableHeader />
      <TableBody>
        {users?.map((user) => (
          <UserTableRow
            key={user.id}
            user={user}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
            onFeature={handleFeatureWriter}
            isFeatured={featuredWriters[user.id]}
          />
        ))}
      </TableBody>
    </Table>
  );
}
