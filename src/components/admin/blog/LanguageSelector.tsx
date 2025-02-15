
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LanguageSelectorProps {
  onLanguageSelect: (language: "english" | "tamil") => void;
}

export function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  return (
    <div className="container max-w-2xl py-20">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Select Blog Language</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 justify-center p-6">
          <Button
            size="lg"
            className="w-40 h-32 flex flex-col gap-2"
            onClick={() => onLanguageSelect("english")}
          >
            <span className="text-xl">English</span>
            <span className="text-sm text-muted-foreground">Write in English</span>
          </Button>
          <Button
            size="lg"
            className="w-40 h-32 flex flex-col gap-2"
            onClick={() => onLanguageSelect("tamil")}
          >
            <span className="text-xl">தமிழ்</span>
            <span className="text-sm text-muted-foreground">Write in Tamil</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
