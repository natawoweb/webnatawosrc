import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./RichTextEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <div>
            <CardTitle>Tamil Content</CardTitle>
            <CardDescription>தமிழில் உங்கள் வலைப்பதிவை எழுதுங்கள்</CardDescription>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col space-y-4">
        <div>
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
        <div className="flex-1 min-h-0">
          <label htmlFor={`content-${language}`} className="text-sm font-medium block mb-2">
            Content
          </label>
          <div className="h-[600px]">
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