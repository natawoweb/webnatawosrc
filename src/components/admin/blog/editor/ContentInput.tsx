
import { Input } from "@/components/ui/input";

interface ContentInputProps {
  language: "english" | "tamil";
  title: string;
  onTitleChange: (value: string) => void;
  placeholder?: string;
}

export function ContentInput({ language, title, onTitleChange, placeholder }: ContentInputProps) {
  return (
    <Input
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
      placeholder={placeholder}
      className="text-4xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-gray-400"
    />
  );
}
