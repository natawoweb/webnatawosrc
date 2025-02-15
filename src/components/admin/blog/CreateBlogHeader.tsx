
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CategoryManagement } from "./CategoryManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateBlogHeaderProps {
  title?: string;
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedLanguage: "english" | "tamil";
  onLanguageChange: (value: "english" | "tamil") => void;
  onBack: () => void;
}

export function CreateBlogHeader({
  title = "Create New Blog",
  categories,
  selectedCategory,
  onCategoryChange,
  onBack,
}: CreateBlogHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <CategoryManagement categories={categories || []} />
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Your content will be automatically saved as a draft while you write. You can access your drafts from the dashboard at any time.
      </p>
    </div>
  );
}
