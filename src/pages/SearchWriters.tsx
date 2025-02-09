
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export default function SearchWriters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const navigate = useNavigate();

  const { data: writers, isLoading } = useQuery({
    queryKey: ["writers", searchTerm, searchType],
    queryFn: async () => {
      console.log("Starting writers search query...");
      if (!searchTerm) {
        const { data, error } = await supabase
          .from("writers")
          .select("*")
          .limit(10);
        
        if (error) {
          console.error("Error fetching writers:", error);
          throw error;
        }
        return data;
      }

      let query = supabase.from("writers").select("*");

      switch (searchType) {
        case "name":
          query = query.ilike("name", `%${searchTerm}%`);
          break;
        case "genre":
          query = query.ilike("genre", `%${searchTerm}%`);
          break;
        case "title":
          query = query.contains("published_works", [{ title: searchTerm }]);
          break;
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error searching writers:", error);
        throw error;
      }
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Search Writers</h1>
      
      <div className="flex gap-4 mb-8">
        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Search by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="genre">Genre</SelectItem>
            <SelectItem value="title">Article Title</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Search writers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : writers?.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No writers found. Try adjusting your search.
          </p>
        ) : (
          writers?.map((writer) => (
            <Card key={writer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {writer.image_url ? (
                    <img
                      src={writer.image_url}
                      alt={writer.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-accent" />
                  )}
                  <div>
                    <h3 className="font-semibold">{writer.name}</h3>
                    <p className="text-sm text-muted-foreground">{writer.genre}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {writer.bio}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/writer/${writer.id}`)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
