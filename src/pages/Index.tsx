import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWriters } from "@/components/home/FeaturedWriters";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedWriters />
      <UpcomingEvents />
    </div>
  );
};

export default Index;