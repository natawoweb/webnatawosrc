
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
      // If content is a string, try to parse it
      let contentObj;
      try {
        contentObj = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
        // Handle double-stringified content
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
      } catch (e) {
        contentObj = rawContent;
      }
      
      // Check if it's already in Draft.js format
      if (contentObj.blocks && Array.isArray(contentObj.blocks)) {
        return typeof contentObj === 'string' ? contentObj : JSON.stringify(contentObj);
      }

      // If it's plain text or another format, convert to Draft.js format
      return JSON.stringify({
        blocks: [{ 
          key: 'initial', 
          text: typeof contentObj === 'string' ? contentObj : String(contentObj), 
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
      // Return empty Draft.js content if there's an error
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
