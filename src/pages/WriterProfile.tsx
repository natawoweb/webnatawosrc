import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Award, BookOpen } from "lucide-react";

const WriterProfile = () => {
  const { id } = useParams();

  const { data: writer, isLoading } = useQuery({
    queryKey: ["writer", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("writers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!writer) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl">Writer not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {writer.image_url ? (
              <img
                src={writer.image_url}
                alt={writer.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-accent" />
            )}
            <div>
              <h1 className="text-3xl font-bold">{writer.name}</h1>
              <p className="text-muted-foreground">{writer.genre}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Biography */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Biography</h2>
            <p className="text-lg whitespace-pre-wrap">{writer.bio}</p>
          </div>

          <Separator />

          {/* Accomplishments */}
          {writer.accomplishments && writer.accomplishments.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Award className="h-6 w-6" />
                Accomplishments
              </h2>
              <ul className="space-y-2">
                {(writer.accomplishments as string[]).map((accomplishment, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-lg">{accomplishment}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Published Works */}
          {writer.published_works && writer.published_works.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Published Works
              </h2>
              <div className="grid gap-4">
                {(writer.published_works as Array<{ title: string; year: string; link: string }>).map(
                  (work, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{work.title}</h3>
                        <p className="text-sm text-muted-foreground">{work.year}</p>
                      </div>
                      <a
                        href={work.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        View <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {writer.social_links && Object.keys(writer.social_links).length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Connect</h2>
                <div className="flex gap-4">
                  {Object.entries(writer.social_links).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {platform} <ExternalLink className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WriterProfile;