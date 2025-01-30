import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryManagement } from "./CategoryManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogDialogHeaderProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export function BlogDialogHeader({
  categories,
  selectedCategory,
  onCategoryChange,
}: BlogDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>Edit Blog</DialogTitle>
      <div className="flex items-center gap-2 mt-4">
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
    </DialogHeader>
  );
}