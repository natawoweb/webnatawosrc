
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Filter, Loader2, Search } from "lucide-react";

interface Writer {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  pseudonym: string | null;
}

export default function SearchWriters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showApproved, setShowApproved] = useState(true);

  const { data: writers, isLoading } = useQuery({
    queryKey: ["writers", searchQuery, showApproved],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, full_name, bio, avatar_url, pseudonym')
        .eq('user_type', 'writer');

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,pseudonym.ilike.%${searchQuery}%`);
      }

      if (showApproved) {
        query = query.eq('approval_status', 'approved');
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Writer[];
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tamil Writers</h1>
          <p className="mt-2 text-muted-foreground">
            Discover and connect with talented Tamil writers from our community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search writers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={showApproved ? "default" : "outline"}
            onClick={() => setShowApproved(!showApproved)}
            className="w-full sm:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showApproved ? "Showing Approved" : "Show All"}
          </Button>
        </div>

        {writers && writers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writers.map((writer) => (
              <Card key={writer.id} className="glass-card">
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
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchQuery 
                ? "No writers found matching your search criteria." 
                : "No writers available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
