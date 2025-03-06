
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Writer } from "@/types/writer";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WriterCardProps {
  writer: Writer;
  onSelect: (writer: Writer) => void;
}

export function WriterCard({ writer, onSelect }: WriterCardProps) {
  const { t } = useLanguage();

  // Fetch the writer's role from user_roles table
  const { data: writerRole } = useQuery({
    queryKey: ["writer-role", writer.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", writer.id)
        .single();

      if (error) {
        console.error("Error fetching writer role:", error);
        return null;
      }
      return data?.role;
    },
  });

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">
                {writer.level}
              </Badge>
              {writerRole && (
                <Badge variant="secondary" className="capitalize">
                  {writerRole}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {writer.bio}
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onSelect(writer)}
        >
          {t("View Profile", "சுயவிவரத்தைக் காண")}
        </Button>
      </CardContent>
    </Card>
  );
}
