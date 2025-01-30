import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/admin/blog/RichTextEditor";
import { Globe, Save, ArrowLeft, Folder } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateBlog() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState("");

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("blog_categories")
        .insert([{ name }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      setNewCategoryName("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create category: " + error.message,
      });
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (blogData: {
      title: string;
      content: string;
      title_tamil?: string;
      content_tamil?: string;
      status: string;
      category_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("blogs")
        .insert({
          title: blogData.title,
          content: blogData.content ? JSON.parse(blogData.content) : {},
          title_tamil: blogData.title_tamil || null,
          content_tamil: blogData.content_tamil ? JSON.parse(blogData.content_tamil) : {},
          author_id: user.id,
          status: blogData.status,
          category_id: blogData.category_id || null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({
        title: "Success",
        description: "Blog created successfully",
      });
      navigate("/admin");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog: " + error.message,
      });
    },
  });

  const handleCreate = (status: "draft" | "pending_approval") => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required",
      });
      return;
    }

    createBlogMutation.mutate({
      title,
      content,
      title_tamil: titleTamil,
      content_tamil: contentTamil,
      status,
      category_id: selectedCategory
    });
  };

  return (
    <div className="container max-w-[1400px] py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Create New Blog</h2>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Folder className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Blog Categories</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button
                      onClick={() => createCategoryMutation.mutate(newCategoryName)}
                      disabled={!newCategoryName}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {categories?.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                        <span>{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => handleCreate("draft")}
              disabled={createBlogMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              onClick={() => handleCreate("pending_approval")}
              disabled={createBlogMutation.isPending}
            >
              Submit for Approval
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* English Section */}
          <Card>
            <CardHeader>
              <CardTitle>English Content</CardTitle>
              <CardDescription>Write your blog post in English</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <div className="min-h-[500px]">
                  <RichTextEditor content={content} onChange={setContent} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tamil Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tamil Content</CardTitle>
                  <CardDescription>தமிழில் உங்கள் வலைப்பதிவை எழுதுங்கள்</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <Globe className="mr-2 h-4 w-4" />
                  Translate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title-tamil" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title-tamil"
                  value={titleTamil}
                  onChange={(e) => setTitleTamil(e.target.value)}
                  placeholder="தலைப்பை உள்ளிடவும்"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content-tamil" className="text-sm font-medium">
                  Content
                </label>
                <div className="min-h-[500px]">
                  <RichTextEditor content={contentTamil} onChange={setContentTamil} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}