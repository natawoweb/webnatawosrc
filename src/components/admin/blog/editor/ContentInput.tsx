import { Input } from "@/components/ui/input";

interface ContentInputProps {
  language: "english" | "tamil";
  title: string;
  onTitleChange: (value: string) => void;
  placeholder: string;
}

export function ContentInput({ language, title, onTitleChange, placeholder }: ContentInputProps) {
  return (
    <div>
      <label htmlFor={`title-${language}`} className="text-sm font-medium">
        Title
      </label>
      <Input
        id={`title-${language}`}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}