import { useParams } from "react-router-dom";
import { useBlogDetail } from "@/hooks/useBlogDetail";
import { EditBlogDialog } from "@/components/admin/blog/EditBlogDialog";

export default function EditBlog() {
  const { id } = useParams();
  const { data: blog, isLoading } = useBlogDetail(id);

  if (!blog || isLoading) return null;

  return <EditBlogDialog blog={blog} />;
}