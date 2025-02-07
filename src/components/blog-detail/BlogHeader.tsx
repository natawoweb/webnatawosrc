
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BlogHeaderProps {
  title: string;
  authorName: string;
  publishedDate: string;
  categoryName: string;
  coverImage?: string;
  viewsCount?: number;
}

export const BlogHeader = ({
  title,
  authorName,
  publishedDate,
  categoryName,
  coverImage,
  viewsCount,
}: BlogHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {coverImage && (
        <img
          src={coverImage}
          alt={title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="flex items-center gap-4 text-muted-foreground mb-8">
        <p>By {authorName || "Anonymous"}</p>
        <p>•</p>
        <p>{new Date(publishedDate).toLocaleDateString()}</p>
        <p>•</p>
        <p>{categoryName || "Uncategorized"}</p>
        <p>•</p>
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <p>{viewsCount || 0} views</p>
        </div>
      </div>
    </>
  );
};
