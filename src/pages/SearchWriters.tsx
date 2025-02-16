
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Writer {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  pseudonym: string | null;
}

export default function SearchWriters() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: writers, isLoading } = useQuery({
    queryKey: ["writers", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, full_name, bio, avatar_url, pseudonym')
        .eq('user_type', 'writer');

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,pseudonym.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Writer[];
    },
  });

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <Card key={key} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Tamil Writers</h1>
        <p className="text-muted-foreground">
          Discover and connect with talented Tamil writers from our community.
        </p>
        <Input
          type="search"
          placeholder="Search writers by name..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        renderSkeletons()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {writers?.map((writer) => (
            <Card key={writer.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={writer.avatar_url || undefined} />
                    <AvatarFallback>
                      {writer.pseudonym?.[0] || writer.full_name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <Link 
                      to={`/writer/${writer.id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {writer.pseudonym || writer.full_name || 'Anonymous Writer'}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {writer.bio || "No bio available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {writers?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "No writers found matching your search." 
                  : "No writers available at the moment."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
