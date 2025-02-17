
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SearchWriters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [selectedWriter, setSelectedWriter] = useState<any>(null);
  const { toast } = useToast();

  const { data: writers, isLoading } = useQuery({
    queryKey: ["writers", searchTerm, searchType],
    queryFn: async () => {
      console.log("Starting writers search query...");
      try {
        if (!searchTerm) {
          const { data, error } = await supabase
            .from("writers")
            .select("*")
            .limit(10);
          
          if (error) {
            console.error("Error fetching writers:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to fetch writers. Please try again.",
            });
            throw error;
          }
          console.log("Writers data:", data);
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
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to search writers. Please try again.",
          });
          throw error;
        }
        console.log("Search results:", data);
        return data;
      } catch (error) {
        console.error("Error in writers query:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while fetching writers.",
        });
        throw error;
      }
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
          <p className="col-span-full text-center">Loading writers...</p>
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
                  onClick={() => setSelectedWriter(writer)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedWriter} onOpenChange={() => setSelectedWriter(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedWriter(null)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-2xl font-bold">
                Writer Profile
              </DialogTitle>
            </div>
          </DialogHeader>

          {selectedWriter && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                {selectedWriter.image_url ? (
                  <img
                    src={selectedWriter.image_url}
                    alt={selectedWriter.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-accent" />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{selectedWriter.name}</h2>
                  <p className="text-muted-foreground">{selectedWriter.genre}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Biography</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedWriter.bio}
                </p>
              </div>

              {selectedWriter.published_works && selectedWriter.published_works.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Published Works</h3>
                  <ul className="space-y-2">
                    {selectedWriter.published_works.map((work: any, index: number) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{work.title}</span>
                        <span className="text-muted-foreground">{work.year}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedWriter.accomplishments && selectedWriter.accomplishments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Accomplishments</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedWriter.accomplishments.map((accomplishment: string, index: number) => (
                      <li key={index}>{accomplishment}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedWriter.social_links && Object.keys(selectedWriter.social_links).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Social Links</h3>
                  <div className="flex gap-4">
                    {Object.entries(selectedWriter.social_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline capitalize"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
