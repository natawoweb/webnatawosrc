import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { useTamilInputSetup } from "./TamilInputSetup";

interface ContentInputProps {
  language: "english" | "tamil";
  title: string;
  onTitleChange: (value: string) => void;
  placeholder: string;
}

export function ContentInput({ language, title, onTitleChange, placeholder }: ContentInputProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  useTamilInputSetup({
    elementRef: titleInputRef.current,
    enabled: language === "tamil"
  });

  return (
    <div>
      <label htmlFor={`title-${language}`} className="text-sm font-medium">
        Title
      </label>
      <Input
        id={`title-${language}`}
        ref={titleInputRef}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}