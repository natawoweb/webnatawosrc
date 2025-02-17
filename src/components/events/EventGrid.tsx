
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ArrowRight, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventGridProps {
  events: Event[];
}

export function EventGrid({ events }: EventGridProps) {
  const navigate = useNavigate();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <div
          key={event.id}
          className="glass-card p-6 space-y-4 transition-all duration-300 hover:scale-[1.02]"
        >
          {event.gallery && Array.isArray(event.gallery) && event.gallery.length > 0 ? (
            <div className="relative aspect-video group">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer w-full h-full">
                    <img
                      src={event.gallery[0] as string}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity"
                    />
                    {event.gallery.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded-md text-xs font-medium">
                        +{event.gallery.length - 1} {t("more", "மேலும்")}
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery.map((url, index) => (
                      <img
                        key={index}
                        src={url as string}
                        alt={`${event.title} gallery ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImageUrl(url as string)}
                      />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.date), "MMMM d, yyyy")}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {event.time}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location}
            </p>
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t(
                `${event.current_participants} / ${event.max_participants} participants`,
                `${event.current_participants} / ${event.max_participants} பங்கேற்பாளர்கள்`
              )}
            </p>
          </div>
          <p className="line-clamp-2 text-muted-foreground">
            {event.description}
          </p>
          <Button
            className="w-full"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            {t("View Details", "விவரங்களைக் காண")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ))}

      {selectedImageUrl && (
        <Dialog open={!!selectedImageUrl} onOpenChange={() => setSelectedImageUrl(null)}>
          <DialogContent className="max-w-4xl p-0">
            <img
              src={selectedImageUrl}
              alt={t("Full size image", "முழு அளவு படம்")}
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
