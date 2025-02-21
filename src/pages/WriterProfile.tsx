
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

export default function WriterProfile() {
  const { id } = useParams();
  const { t } = useLanguage();

  const { data: writer, isLoading } = useQuery({
    queryKey: ["writer", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("writers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!writer) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center text-muted-foreground">
          {t("Writer not found", "எழுத்தாளர் கிடைக்கவில்லை")}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {writer.image_url ? (
              <img
                src={writer.image_url}
                alt={writer.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center">
                <span className="text-4xl font-semibold text-muted-foreground">
                  {writer.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{writer.name}</h1>
              <p className="text-muted-foreground">{writer.genre}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("About", "பற்றி")}
            </h2>
            <p className="text-lg whitespace-pre-wrap">{writer.bio}</p>
          </div>

          {writer.published_works && writer.published_works.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t("Published Works", "வெளியிடப்பட்ட படைப்புகள்")}
              </h2>
              <ul className="space-y-2">
                {writer.published_works.map((work, index) => (
                  <li key={index}>
                    <span className="font-medium">{work.title}</span> ({work.year})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {writer.accomplishments && writer.accomplishments.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t("Accomplishments", "சாதனைகள்")}
              </h2>
              <ul className="list-disc list-inside space-y-2">
                {writer.accomplishments.map((accomplishment, index) => (
                  <li key={index}>{accomplishment}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
