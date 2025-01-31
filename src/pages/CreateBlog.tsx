import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, SendHorizontal, ArrowLeft } from "lucide-react";
import { BlogContentSection } from "@/components/admin/blog/BlogContentSection";
import { CategoryManagement } from "@/components/admin/blog/CategoryManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateBlog() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(JSON.stringify({
    type: 'doc',
    content: [{
      type: 'paragraph',
      content: []
    }]
  }));
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState(JSON.stringify({
    type: 'doc',
    content: [{
      type: 'paragraph',
      content: []
    }]
  }));
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

  const handleTranslate = async () => {
    try {
      const contentObj = JSON.parse(content || '{}');
      const textContent = contentObj.content?.[0]?.content?.[0]?.text || '';

      const titleResponse = await supabase.functions.invoke('translate', {
        body: { text: title }
      });

      if (titleResponse.error) throw new Error(titleResponse.error.message);
      
      const contentResponse = await supabase.functions.invoke('translate', {
        body: { text: textContent }
      });

      if (contentResponse.error) throw new Error(contentResponse.error.message);

      const translatedTitle = titleResponse.data.data.translations[0].translatedText;
      setTitleTamil(translatedTitle);

      const translatedText = contentResponse.data.data.translations[0].translatedText;
      const newContent = {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            text: translatedText
          }]
        }]
      };
      setContentTamil(JSON.stringify(newContent));

      toast({
        title: "Translation Complete",
        description: "Content has been translated to Tamil",
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: error.message,
      });
    }
  };

  const hasContent = () => {
    try {
      if (!title) return false;
      const contentObj = JSON.parse(content || '{}');
      const textContent = contentObj.content?.[0]?.content?.[0]?.text;
      return Boolean(textContent);
    } catch (error) {
      return false;
    }
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
            <CategoryManagement categories={categories || []} />
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
              <SendHorizontal className="mr-2 h-4 w-4" />
              Submit for Approval
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <BlogContentSection
            language="english"
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onTranslate={handleTranslate}
            hasContent={hasContent()}
          />
          <BlogContentSection
            language="tamil"
            title={titleTamil}
            content={contentTamil}
            onTitleChange={setTitleTamil}
            onContentChange={setContentTamil}
          />
        </div>
      </div>
    </div>
  );
}