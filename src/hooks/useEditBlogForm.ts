
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

export function useEditBlogForm(blogId: string | undefined) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Function to ensure content is in Draft.js format
  const ensureDraftJsFormat = (rawContent: any) => {
    if (!rawContent) {
      return JSON.stringify({
        blocks: [{ 
          key: 'initial', 
          text: '', 
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }],
        entityMap: {}
      });
    }

    try {
      // First try to parse the content if it's a string
      const contentObj = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

      // If it's already in Draft.js format, return it stringified
      if (contentObj.blocks && Array.isArray(contentObj.blocks)) {
        return JSON.stringify(contentObj);
      }

      // If it's not in Draft.js format, create a new Draft.js content structure
      return JSON.stringify({
        blocks: [{ 
          key: 'initial', 
          text: typeof contentObj === 'string' ? contentObj : JSON.stringify(contentObj), 
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }],
        entityMap: {}
      });
    } catch (error) {
      console.error('Error processing content:', error);
      return JSON.stringify({
        blocks: [{ 
          key: 'initial', 
          text: '', 
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }],
        entityMap: {}
      });
    }
  };

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single();

      if (error) throw error;
      console.log('Retrieved blog data:', data);
      return data;
    },
  });

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

  // Initialize form data when blog data is loaded
  useEffect(() => {
    if (!blog) return;

    console.log('Initializing blog data:', {
      title: blog.title,
      content: blog.content,
      titleTamil: blog.title_tamil,
      contentTamil: blog.content_tamil
    });
    
    setTitle(blog.title || "");
    setContent(ensureDraftJsFormat(blog.content));
    setTitleTamil(blog.title_tamil || "");
    setContentTamil(ensureDraftJsFormat(blog.content_tamil));
    setSelectedCategory(blog.category_id || "");
  }, [blog]);

  return {
    title,
    content,
    titleTamil,
    contentTamil,
    selectedCategory,
    setTitle,
    setContent,
    setTitleTamil,
    setContentTamil,
    setSelectedCategory,
    blog,
    categories,
    isLoading
  };
}
