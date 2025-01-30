import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-primary-royal/10 to-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary-royal animate-in fade-in slide-in duration-1000">
              Where Words Come to Life
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in duration-1000 delay-200">
              Join our community of writers and readers. Share your stories, discover new voices, and be part of something extraordinary.
            </p>
            <div className="mt-10 flex justify-center gap-4 animate-in fade-in slide-in duration-1000 delay-300">
              <Button size="lg" className="bg-primary-royal hover:bg-primary-royal/90 group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary-royal text-primary-royal hover:bg-primary-royal/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Writers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-warm/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-royal">Featured Writers</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover talented voices from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Writer Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] border-primary-royal/10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary-royal/10" />
                  <div>
                    <h3 className="font-semibold text-primary-royal">Writer Name</h3>
                    <p className="text-sm text-muted-foreground">Genre</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  A brief bio about the writer and their work...
                </p>
                <Button variant="ghost" className="mt-4 w-full text-primary-royal hover:bg-primary-royal/10">
                  View Profile
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary-royal/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-royal">Ready to Share Your Story?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community of writers and start sharing your work with readers around the world.
          </p>
          <Button size="lg" className="mt-8 bg-primary-royal hover:bg-primary-royal/90">
            Start Writing
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;