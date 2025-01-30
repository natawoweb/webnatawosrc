import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  const leadershipTeam = [
    {
      name: "Dr. Lakshmi Chandran",
      role: "President",
      bio: "With over 20 years of experience in Tamil literature and education, Dr. Chandran leads our organization's mission to promote Tamil literary arts.",
      image: "/placeholder.svg"
    },
    {
      name: "Rajesh Kumar",
      role: "Vice President",
      bio: "A published author and community organizer, Rajesh focuses on building connections between writers and readers across North America.",
      image: "/placeholder.svg"
    },
    {
      name: "Priya Subramaniam",
      role: "Secretary",
      bio: "An accomplished translator and editor, Priya manages our organization's day-to-day operations and communication initiatives.",
      image: "/placeholder.svg"
    }
  ];

  const milestones = [
    {
      year: 2018,
      event: "Foundation of Writers Hub North America"
    },
    {
      year: 2019,
      event: "First Annual Tamil Literary Festival"
    },
    {
      year: 2020,
      event: "Launch of Digital Library Initiative"
    },
    {
      year: 2021,
      event: "Establishment of Writers Mentorship Program"
    },
    {
      year: 2022,
      event: "Opening of Regional Chapters across Major Cities"
    }
  ];

  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* Mission Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">About Us</h1>
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              To promote Tamil literature and create a vibrant community of writers and readers across North America, 
              fostering cultural exchange and literary excellence through events, workshops, and collaborative initiatives.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Organization Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">About the Organization</h3>
              <p>
                Writers Hub is a non-profit organization established in 2018 to serve as a bridge between Tamil writers 
                and readers in North America. We organize literary events, workshops, and provide platforms for writers 
                to showcase their work while helping readers discover rich Tamil literature.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Bylaws</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <img 
                    src="/placeholder.svg" 
                    alt="Bylaws Page 1" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </Card>
                <Card className="p-4">
                  <img 
                    src="/placeholder.svg" 
                    alt="Bylaws Page 2" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* History Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg">
                Founded in 2018 by a group of passionate Tamil writers and literature enthusiasts, 
                Writers Hub has grown from a small community gathering to a prominent organization 
                serving the Tamil literary community across North America.
              </p>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.year} className="flex items-start gap-4">
                    <span className="font-bold text-xl">{milestone.year}</span>
                    <p>{milestone.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Leadership Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Leadership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leadershipTeam.map((leader) => (
                <Card key={leader.name} className="overflow-hidden">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-xl">{leader.name}</h3>
                    <p className="text-muted-foreground">{leader.role}</p>
                    <p className="mt-2 text-sm">{leader.bio}</p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Membership Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">For Writers</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access to writing workshops and seminars</li>
                  <li>Opportunities to publish in our quarterly journal</li>
                  <li>Networking events with fellow writers</li>
                  <li>Mentorship programs</li>
                  <li>Priority registration for literary festivals</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">For Readers</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access to our digital library</li>
                  <li>Invitations to book launches and readings</li>
                  <li>Quarterly newsletter with literary updates</li>
                  <li>Discounted tickets to events</li>
                  <li>Book club membership</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}