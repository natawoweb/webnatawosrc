import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="container mx-auto py-8">
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
        <CardContent>
          <p className="text-lg whitespace-pre-wrap">{writer.bio}</p>
          {writer.social_links && Object.keys(writer.social_links).length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Connect</h2>
              <div className="flex gap-4">
                {Object.entries(writer.social_links).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WriterProfile;