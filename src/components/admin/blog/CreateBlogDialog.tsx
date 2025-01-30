import { Button } from "@/components/ui/button";
import { BookPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CreateBlogDialog() {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate("/admin/create-blog")}>
      <BookPlus className="mr-2 h-4 w-4" />
      Create Blog
    </Button>
  );
}