import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, MapPin, Clock } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const { data: featuredWriters } = useQuery({
    queryKey: ["featuredWriters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("writers")
        .select("*")
        .eq("featured", true)
        .order("featured_month", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_upcoming", true)
        .order("date", { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-in fade-in slide-in duration-1000">
              Celebrate Tamil Literature Across North America
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in duration-1000 delay-200">
              Join our vibrant community of writers and readers celebrating Tamil literary excellence.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in duration-1000 delay-300">
              <Button size="lg" className="group" onClick={() => navigate('/auth')}>
                <Users className="mr-2 h-4 w-4" />
                Join Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/search')}>
                Discover Writers
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/events')}>
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Writer Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Writer of the Month</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover talented voices from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWriters?.map((writer) => (
              <div
                key={writer.id}
                className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-4">
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
                    <p className="text-sm text-muted-foreground">{writer.genre}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                  {writer.bio}
                </p>
                <Button
                  variant="ghost"
                  className="mt-4 w-full"
                  onClick={() => navigate(`/writer/${writer.id}`)}
                >
                  View Profile
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join us at our upcoming literary events and gatherings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsLoading ? (
              <div className="col-span-3 text-center">Loading events...</div>
            ) : upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="glass-card p-6 space-y-4 transition-all duration-300 hover:scale-[1.02]"
                >
                  {event.gallery && event.gallery.length > 0 && (
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                      <img
                        src={event.gallery[0]}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
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
                      {event.current_participants} / {event.max_participants} participants
                    </p>
                  </div>
                  <p className="line-clamp-2 text-muted-foreground">
                    {event.description}
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No upcoming events at the moment.
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/events")}
              className="group"
            >
              View All Events
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
