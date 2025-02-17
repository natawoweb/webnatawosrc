
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Writer } from "@/types/writer";

interface WriterProfileProps {
  writer: Writer | null;
  onClose: () => void;
}

export function WriterProfile({ writer, onClose }: WriterProfileProps) {
  const { t } = useLanguage();

  if (!writer) return null;

  return (
    <Dialog open={!!writer} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-2xl font-bold">
              {t("Writer Profile", "எழுத்தாளர் சுயவிவரம்")}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-6">
            {writer.image_url ? (
              <img
                src={writer.image_url}
                alt={writer.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-accent" />
            )}
            <div>
              <h2 className="text-2xl font-bold">{writer.name}</h2>
              <p className="text-muted-foreground">{writer.genre}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("Biography", "சுயசரிதை")}
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {writer.bio}
            </p>
          </div>

          {writer.published_works && writer.published_works.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("Published Works", "வெளியிடப்பட்ட படைப்புகள்")}
              </h3>
              <ul className="space-y-2">
                {writer.published_works.map((work, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{work.title}</span>
                    <span className="text-muted-foreground">{work.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {writer.accomplishments && writer.accomplishments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("Accomplishments", "சாதனைகள்")}
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {writer.accomplishments.map((accomplishment, index) => (
                  <li key={index}>{accomplishment}</li>
                ))}
              </ul>
            </div>
          )}

          {writer.social_links && Object.keys(writer.social_links).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("Social Links", "சமூக இணைப்புகள்")}
              </h3>
              <div className="flex gap-4">
                {Object.entries(writer.social_links).map(([platform, url]) => (
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
      </DialogContent>
    </Dialog>
  );
}
