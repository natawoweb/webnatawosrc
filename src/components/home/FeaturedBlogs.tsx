
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { BlogContent } from "@/components/blog-detail/BlogContent";
import { useLanguage } from "@/contexts/LanguageContext";

type Blog = Database["public"]["Tables"]["blogs"]["Row"] & {
  profiles: {
    full_name: string | null;
    pseudonym: string | null;
  } | null;
};

export function FeaturedBlogs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ["featured-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          profiles (
            full_name,
            pseudonym
          )
        `)
        .eq('featured', true)
        .eq('status', 'published')
        .order('featured_month', { ascending: false });

      if (error) {
        console.error("Error fetching featured blogs:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch featured blogs. Please try again later.",
        });
        throw error;
      }

      return data as Blog[];
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (error) {
    console.error("Error in featured blogs component:", error);
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          {t("Failed to load featured blogs.", "சிறப்பு வலைப்பதிவுகளை ஏற்ற முடியவில்லை.")}
        </p>
      </div>
    );
  }

  const getAuthorName = (blog: Blog) => {
    if (!blog.profiles) return t("Anonymous", "அநாமதேயர்");
    return blog.profiles.pseudonym || blog.profiles.full_name || t("Anonymous", "அநாமதேயர்");
  };

  const getTitle = (blog: Blog) => {
    return language === 'tamil' && blog.title_tamil ? blog.title_tamil : blog.title;
  };

  const getContent = (blog: Blog) => {
    return language === 'tamil' && blog.content_tamil ? blog.content_tamil : blog.content;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-y">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            {t("Featured Blogs", "சிறப்பு வலைப்பதிவுகள்")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t(
              "Discover our hand-picked selection of outstanding content",
              "எங்களின் தேர்ந்தெடுக்கப்பட்ட சிறந்த படைப்புகளைக் காணுங்கள்"
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center">
            {t("Loading featured blogs...", "சிறப்பு வலைப்பதிவுகள் ஏற்றப்படுகின்றன...")}
          </div>
        ) : blogs && blogs.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {blogs.map((blog) => (
                <CarouselItem key={blog.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="rounded-lg p-6 h-full transition-all duration-300 hover:scale-[1.02] bg-card text-card-foreground shadow-lg border hover:border-primary/20">
                    {blog.cover_image && (
                      <img
                        src={blog.cover_image}
                        alt={getTitle(blog)}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                      {getTitle(blog)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t("By", "எழுதியவர்")} {getAuthorName(blog)}
                    </p>
                    <div className="mt-4 text-sm text-muted-foreground line-clamp-3">
                      <BlogContent content={getContent(blog)} />
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-4 w-full hover:bg-accent"
                      onClick={() => navigate(`/blogs/${blog.id}`)}
                    >
                      {t("Read More", "மேலும் படிக்க")}
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        ) : (
          <div className="text-center text-muted-foreground">
            {t(
              "No featured blogs at the moment",
              "தற்போது சிறப்பு வலைப்பதிவுகள் எதுவும் இல்லை"
            )}
          </div>
        )}
      </div>
    </section>
  );
}
