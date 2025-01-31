import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function FeaturedWriters() {
  const navigate = useNavigate();
  
  const { data: featuredWriters } = useQuery({
    queryKey: ["featuredWriters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("writers")
        .select("*")
        .eq("featured", true)
        .order("featured_month", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Featured Writer of the Month</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover talented voices from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredWriters?.map((writer) => (
            <div
              key={writer.id}
              className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
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
          ))}
        </div>
      </div>
    </section>
  );
}