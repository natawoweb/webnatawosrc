
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWriters } from "@/components/home/FeaturedWriters";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const createAdminUser = async () => {
      try {
        const response = await fetch(
          'https://yqqfxpvptgcczumqowpc.supabase.co/functions/v1/create-user',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              email: "shyamcsg@gmail.com",
              fullName: "Shyam Admin",
              role: "admin"
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error('Error creating admin user:', error);
          return;
        }

        const data = await response.json();
        console.log('Admin user created successfully. Temporary password:', data.tempPassword);
      } catch (error) {
        console.error('Error creating admin user:', error);
      }
    };

    createAdminUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedWriters />
      <UpcomingEvents />
    </div>
  );
};

export default Index;
