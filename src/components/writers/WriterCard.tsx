
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Writer } from "@/types/writer";
import { Badge } from "@/components/ui/badge";

interface WriterCardProps {
  writer: Writer;
  onSelect: (writer: Writer) => void;
}

export function WriterCard({ writer, onSelect }: WriterCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="h-[300px] hover:shadow-lg transition-shadow">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header Section - Fixed height */}
        <div className="h-[70px] flex items-start gap-3">
          {writer.image_url ? (
            <img
              src={writer.image_url}
              alt={writer.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-muted-foreground">
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
            </div>
          </div>
        </div>

        {/* Bio Section - Flexible height with line clamp */}
        <div className="flex-1 min-h-[120px] overflow-hidden my-2">
          <p className="text-sm text-muted-foreground line-clamp-4">
            {writer.bio}
          </p>
        </div>

        {/* Action Button Section - Fixed height */}
        <div className="h-[40px]">
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
