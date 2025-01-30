import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./RichTextEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface BlogContentSectionProps {
  language: "english" | "tamil";
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export function BlogContentSection({
  language,
  title,
  content,
  onTitleChange,
  onContentChange,
}: BlogContentSectionProps) {
  const isEnglish = language === "english";

  return (
    <Card className="h-[800px] flex flex-col">
      <CardHeader>
        {isEnglish ? (
          <>
            <CardTitle>English Content</CardTitle>
            <CardDescription>Write your blog post in English</CardDescription>
          </>
        ) : (
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
        )}
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="space-y-2">
          <label htmlFor={`title-${language}`} className="text-sm font-medium">
            Title
          </label>
          <Input
            id={`title-${language}`}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={isEnglish ? "Enter blog title" : "தலைப்பை உள்ளிடவும்"}
          />
        </div>
        <div className="space-y-2 flex-grow h-full">
          <label htmlFor={`content-${language}`} className="text-sm font-medium">
            Content
          </label>
          <div className="h-[650px]">
            <RichTextEditor
              content={content}
              onChange={onContentChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}