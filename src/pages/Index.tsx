import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
              <Button size="lg" className="group">
                <Users className="mr-2 h-4 w-4" />
                Join Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Discover Writers
              </Button>
              <Button size="lg" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Writer of the Month Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Writer of the Month</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover talented voices from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Writer Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-accent" />
                  <div>
                    <h3 className="font-semibold">Writer Name</h3>
                    <p className="text-sm text-muted-foreground">Genre</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  A brief bio about the writer and their work...
                </p>
                <Button variant="ghost" className="mt-4 w-full">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Calendar */}
            <div className="glass-card p-6">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            {/* Event List */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Event Title</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Location • Date & Time
                      </p>
                      <p className="text-sm mt-2">
                        Brief description of the event...
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;