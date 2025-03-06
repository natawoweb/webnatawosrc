
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
    <Card className="h-[400px] hover:shadow-lg transition-shadow">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header Section - Fixed height */}
        <div className="h-[100px] flex items-start gap-4">
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
            <h3 className="font-semibold text-wrap break-words">{writer.name}</h3>
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

        {/* Bio Section - Flexible height with line clamp */}
        <div className="flex-1 min-h-[200px] overflow-hidden">
          <p className="text-sm text-muted-foreground line-clamp-6">
            {writer.bio}
          </p>
        </div>

        {/* Action Button Section - Fixed height */}
        <div className="h-[60px] pt-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onSelect(writer)}
          >
            {t("View Profile", "சுயவிவரத்தைக் காண")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
