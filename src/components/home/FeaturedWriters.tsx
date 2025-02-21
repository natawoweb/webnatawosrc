
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";

export function FeaturedWriters() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const { data: writers, isLoading, error } = useQuery({
    queryKey: ["writers", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("writers")
        .select("*");

      if (searchQuery) {
        // Only search by name, removing genre from search
        query = query.ilike("name", `%${searchQuery}%`);
      } else {
        query = query.eq("featured", true)
          .order("featured_month", { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching writers:", error);
        toast({
          variant: "destructive",
          title: t("Error", "பிழை"),
          description: t("Failed to fetch writers. Please try again later.", "எழுத்தாளர்களைப் பெற முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்."),
        });
        throw error;
      }

      return data || [];
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
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

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          {t("Failed to load featured writers.", "சிறப்பு எழுத்தாளர்களை ஏற்ற முடியவில்லை.")}
        </p>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">{t("Featured Writers", "சிறப்பு எழுத்தாளர்கள்")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("Discover talented voices from our community", "எங்கள் சமூகத்தின் திறமையான குரல்களைக் கண்டறியுங்கள்")}
          </p>
          <div className="max-w-md mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search writers by name...", "பெயரால் எழுத்தாளர்களைத் தேடுங்கள்...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">{t("Loading writers...", "எழுத்தாளர்கள் ஏற்றப்படுகிறது...")}</div>
        ) : writers && writers.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto relative"
          >
            <CarouselContent>
              {writers.map((writer) => (
                <CarouselItem key={writer.id} className="md:basis-1/3 lg:basis-1/3">
                  <div className="p-4 h-[400px]">
                    <div className="flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                      {/* Header Section - Fixed height */}
                      <div className="p-6 h-[100px] flex items-start gap-4">
                        {writer.image_url ? (
                          <img
                            src={writer.image_url}
                            alt={writer.name}
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-semibold text-muted-foreground">
                              {writer.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-wrap break-words">
                            {writer.name}
                          </h3>
                        </div>
                      </div>

                      {/* Featured Status - Fixed height */}
                      <div className="px-6 h-[40px]">
                        {writer.featured_month && (
                          <p className="text-xs text-muted-foreground">
                            {t("Featured:", "சிறப்பிக்கப்பட்டது:")} {formatFeaturedMonth(writer.featured_month)}
                          </p>
                        )}
                      </div>

                      {/* Bio Section - Fixed height with overflow */}
                      <div className="p-6 flex-1 min-h-[180px] overflow-hidden">
                        <p className="text-sm text-muted-foreground line-clamp-6">
                          {writer.bio}
                        </p>
                      </div>

                      {/* Button Section - Fixed height */}
                      <div className="p-6 h-[80px]">
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => navigate(`/writer/${writer.id}`)}
                        >
                          {t("View Profile", "சுயவிவரத்தைக் காண")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 hidden md:flex" />
            <CarouselNext className="absolute -right-12 hidden md:flex" />
          </Carousel>
        ) : (
          <div className="text-center text-muted-foreground">
            {t("No writers found", "எழுத்தாளர்கள் எதுவும் கிடைக்கவில்லை")}
          </div>
        )}
      </div>
    </section>
  );
}
