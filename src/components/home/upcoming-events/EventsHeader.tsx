import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EventsHeader() {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold">Upcoming Events</h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Join us at our upcoming literary events and gatherings
      </p>
      <Button
        variant="outline"
        size="lg"
        onClick={() => navigate("/events")}
        className="group mt-8"
      >
        View All Events
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}