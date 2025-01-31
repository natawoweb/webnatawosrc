import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EventsHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center space-y-4 py-12">
      <h1 className="text-4xl font-bold">Literary Events</h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        Join our vibrant community at various literary events, workshops, and gatherings. 
        Connect with fellow writers and readers while exploring the world of literature.
      </p>
      <Button onClick={() => navigate("/events/register")} className="mt-4">
        <Calendar className="mr-2 h-4 w-4" />
        Register for Event
      </Button>
    </div>
  );
}