
import { Star, StarOff, Trash2 } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface BlogRatingProps {
  blogId: string;
  initialRating?: number;
}

export const BlogRating = ({ blogId, initialRating = 0 }: BlogRatingProps) => {
  const { session } = useSession();
  const { toast } = useToast();
  const [userRating, setUserRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRating = async (rating: number) => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to rate this blog",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("blog_ratings")
        .upsert({
          blog_id: blogId,
          user_id: session.user.id,
          rating,
        });

      if (error) throw error;

      setUserRating(rating);
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDeleteRating = async () => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from("blog_ratings")
        .delete()
        .eq("blog_id", blogId)
        .eq("user_id", session.user.id);

      if (error) throw error;

      setUserRating(0);
      toast({
        title: "Success",
        description: "Rating removed successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex items-center gap-2 mb-8">
      <h3 className="text-xl font-semibold mr-4">Rate this blog</h3>
      <div className="flex items-center gap-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              className="p-1 hover:scale-110 transition-transform"
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => handleRating(rating)}
              disabled={!session}
            >
              {rating <= (hoveredRating || userRating) ? (
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="w-6 h-6" />
              )}
            </button>
          ))}
        </div>
        {userRating > 0 && session && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteRating}
            className="ml-2"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
      {!session && (
        <span className="text-sm text-muted-foreground ml-4">
          Please login to rate
        </span>
      )}
    </div>
  );
};
