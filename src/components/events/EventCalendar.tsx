import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export function EventCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  const { data: events } = useQuery({
    queryKey: ["events-calendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Get events for the selected date
  const selectedDateEvents = events?.filter(event => {
    const eventDate = new Date(event.date);
    return selectedDate && 
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear();
  });

  // Get all dates that have events
  const eventDates = events?.map(event => new Date(event.date));

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-auto">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{
            hasEvent: (date) => 
              eventDates?.some(eventDate => 
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
              ) || false,
          }}
          modifiersStyles={{
            hasEvent: {
              fontWeight: 'bold',
              textDecoration: 'underline',
              color: 'var(--primary)',
            },
          }}
          className="rounded-md border shadow"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Events on {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "selected date"}
        </h3>
        
        {selectedDateEvents && selectedDateEvents.length > 0 ? (
          <div className="space-y-4">
            {selectedDateEvents.map((event) => (
              <Card
                key={event.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                  <Badge variant={event.is_upcoming ? "default" : "secondary"}>
                    {event.is_upcoming ? "Upcoming" : "Past"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No events scheduled for this date.</p>
        )}
      </div>
    </div>
  );
}