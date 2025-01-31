import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWriters } from "@/components/home/FeaturedWriters";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { BlogSearch } from "@/components/home/BlogSearch";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <BlogSearch />
      <FeaturedWriters />
      <UpcomingEvents />
    </div>
  );
};

export default Index;