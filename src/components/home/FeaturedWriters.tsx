
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function FeaturedWriters() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: writers, isLoading } = useQuery({
    queryKey: ["writers", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("writers")
        .select("*");

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,genre.ilike.%${searchQuery}%`);
      } else {
        query = query.eq("featured", true)
          .order("featured_month", { ascending: false });
      }

      const { data, error } = await query;
      
      console.log("Writers query result:", { data, error }); // Debug log
      
      if (error) {
        console.error("Error fetching writers:", error);
        throw error;
      }
      return data || []; // Ensure we return an empty array if data is null
    },
  });

  const formatFeaturedMonth = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "MMMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  console.log("Current writers state:", writers); // Debug log

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Featured Writers</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover talented voices from our community
          </p>
          <div className="max-w-md mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search writers by name or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">Loading writers...</div>
        ) : writers && writers.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {writers.map((writer) => (
                <CarouselItem key={writer.id} className="md:basis-1/3">
                  <div className="glass-card p-6 h-full transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center space-x-4">
                      {writer.image_url ? (
                        <img
                          src={writer.image_url}
                          alt={writer.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                          <span className="text-2xl font-semibold text-muted-foreground">
                            {writer.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{writer.name}</h3>
                        <p className="text-sm text-muted-foreground">{writer.genre}</p>
                        {writer.featured_month && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Featured: {formatFeaturedMonth(writer.featured_month)}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                      {writer.bio}
                    </p>
                    <Button
                      variant="ghost"
                      className="mt-4 w-full"
                      onClick={() => navigate(`/writer/${writer.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        ) : (
          <div className="text-center text-muted-foreground">
            No writers found
          </div>
        )}
      </div>
    </section>
  );
}
