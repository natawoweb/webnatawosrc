
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, SendHorizontal } from "lucide-react";
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
  onSubmit: () => void;
  onSaveDraft: () => void;
  isSubmitting: boolean;
  isSaving: boolean;
}

export function CreateBlogHeader({
  title = "Create New Blog",
  categories,
  selectedCategory,
  onCategoryChange,
  onBack,
  onSubmit,
  onSaveDraft,
  isSubmitting,
  isSaving,
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
          <Button
            onClick={onSaveDraft}
            disabled={isSaving}
            variant="outline"
          >
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            <SendHorizontal className="mr-2 h-4 w-4" />
            Submit for Approval
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Click "Save as Draft" to save your work or "Submit for Approval" when you're ready to publish.
      </p>
    </div>
  );
}
