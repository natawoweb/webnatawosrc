
import { useLanguage } from "@/contexts/LanguageContext";

interface EventImageProps {
  image: string | null;
  title: string;
}

export function EventImage({ image, title }: EventImageProps) {
  const { t } = useLanguage();
  
  if (!image) {
    return (
      <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center text-muted-foreground">
        {t("No image available", "படம் கிடைக்கவில்லை")}
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={title}
      className="w-full aspect-[16/9] object-cover rounded-t-lg"
    />
  );
}
