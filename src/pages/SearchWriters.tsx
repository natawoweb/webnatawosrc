
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { WriterSearch } from "@/components/writers/WriterSearch";
import { WriterCard } from "@/components/writers/WriterCard";
import { WriterProfile } from "@/components/writers/WriterProfile";
import type { Writer } from "@/types/writer";

export default function SearchWriters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [selectedWriter, setSelectedWriter] = useState<Writer | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

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
              title: t("Error", "பிழை"),
              description: t(
                "Failed to fetch writers. Please try again.",
                "எழுத்தாளர்களை பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
              ),
            });
            throw error;
          }

          // Transform the data to match the Writer type
          const transformedData = data.map((writer) => ({
            id: writer.id,
            name: writer.name,
            bio: writer.bio,
            genre: writer.genre,
            image_url: writer.image_url,
            published_works: writer.published_works ? JSON.parse(writer.published_works as string) : null,
            accomplishments: writer.accomplishments ? JSON.parse(writer.accomplishments as string) : null,
            social_links: writer.social_links ? JSON.parse(writer.social_links as string) : null,
            created_at: writer.created_at,
            featured: writer.featured || false,
            featured_month: writer.featured_month || ""
          }));

          console.log("Writers data:", transformedData);
          return transformedData;
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
            title: t("Error", "பிழை"),
            description: t(
              "Failed to search writers. Please try again.",
              "எழுத்தாளர்களை தேட முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
            ),
          });
          throw error;
        }

        // Transform the search results data
        const transformedData = data.map((writer) => ({
          id: writer.id,
          name: writer.name,
          bio: writer.bio,
          genre: writer.genre,
          image_url: writer.image_url,
          published_works: writer.published_works ? JSON.parse(writer.published_works as string) : null,
          accomplishments: writer.accomplishments ? JSON.parse(writer.accomplishments as string) : null,
          social_links: writer.social_links ? JSON.parse(writer.social_links as string) : null,
          created_at: writer.created_at,
          featured: writer.featured || false,
          featured_month: writer.featured_month || ""
        }));

        console.log("Search results:", transformedData);
        return transformedData;
      } catch (error) {
        console.error("Error in writers query:", error);
        toast({
          variant: "destructive",
          title: t("Error", "பிழை"),
          description: t(
            "An error occurred while fetching writers.",
            "எழுத்தாளர்களை பெறும்போது பிழை ஏற்பட்டது."
          ),
        });
        throw error;
      }
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        {t("Search Writers", "எழுத்தாளர்களைத் தேடுங்கள்")}
      </h1>
      
      <WriterSearch
        searchTerm={searchTerm}
        searchType={searchType}
        onSearchTermChange={setSearchTerm}
        onSearchTypeChange={setSearchType}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center">
            {t("Loading writers...", "எழுத்தாளர்களை ஏற்றுகிறது...")}
          </p>
        ) : writers?.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            {t(
              "No writers found. Try adjusting your search.",
              "எழுத்தாளர்கள் எவரும் கிடைக்கவில்லை. உங்கள் தேடலை மாற்றி முயற்சிக்கவும்."
            )}
          </p>
        ) : (
          writers?.map((writer) => (
            <WriterCard
              key={writer.id}
              writer={writer}
              onSelect={setSelectedWriter}
            />
          ))
        )}
      </div>

      <WriterProfile
        writer={selectedWriter}
        onClose={() => setSelectedWriter(null)}
      />
    </div>
  );
}
