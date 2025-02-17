
import { Input } from "@/components/ui/input";

interface ContentInputProps {
  language: "english" | "tamil";
  title: string;
  onTitleChange: (value: string) => void;
  placeholder?: string;
}

export function ContentInput({ language, title, onTitleChange, placeholder }: ContentInputProps) {
  console.log(`ContentInput rendering for ${language}:`, { title, placeholder });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Title change in ${language}:`, e.target.value);
    onTitleChange(e.target.value);
  };

  return (
    <Input
      value={title}
      onChange={handleChange}
      placeholder={placeholder}
      className="text-4xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-gray-400"
    />
  );
}
