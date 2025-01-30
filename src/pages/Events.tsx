import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin } from "lucide-react";

// This is a placeholder component. In a real application, you would fetch events from your database
const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Tamil Literature Festival 2024",
    date: "2024-05-15",
    time: "10:00 AM",
    location: "Toronto Convention Center",
    description: "A celebration of Tamil literature featuring readings, discussions, and workshops.",
  },
  // Add more events as needed
];

const PAST_EVENTS = [
  {
    id: 101,
    title: "Writers Workshop 2023",
    date: "2023-11-20",
    location: "Vancouver Public Library",
    description: "An intensive workshop on modern Tamil writing techniques.",
    gallery: ["image1.jpg", "image2.jpg"], // These would be actual image URLs in production
  },
  // Add more past events
];

export default function Events() {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid gap-6">
            {UPCOMING_EVENTS.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </p>
                      </div>
                      <p className="mt-4">{event.description}</p>
                    </div>
                    <Button>Register Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid gap-6">
            {PAST_EVENTS.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </p>
                  </div>
                  <p className="mb-4">{event.description}</p>
                  
                  {/* Gallery */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {event.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-accent rounded-md"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}