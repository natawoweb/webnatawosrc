
import { BlogContentSection } from "./BlogContentSection";
import { CreateBlogHeader } from "./CreateBlogHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface BlogFormProps {
  title?: string;
  categories: Array<{ id: string; name: string }>;
  selectedLanguage: "english" | "tamil";
  setSelectedLanguage: (language: "english" | "tamil") => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  handleSubmit: () => void;
  handleTranslate: () => void;
  handleBack: () => void;
  currentTitle: string;
  content: string;
  titleTamil: string;
  contentTamil: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTitleTamil: (title: string) => void;
  setContentTamil: (content: string) => void;
  hasContent: () => boolean;
  isSubmitting: boolean;
}

export function BlogForm({
  title = "Create New Blog",
  categories,
  selectedLanguage,
  setSelectedLanguage,
  selectedCategory,
  setSelectedCategory,
  handleSubmit,
  handleTranslate,
  handleBack,
  currentTitle,
  content,
  titleTamil,
  contentTamil,
  setTitle,
  setContent,
  setTitleTamil,
  setContentTamil,
  hasContent,
  isSubmitting,
}: BlogFormProps) {
  return (
    <div className="container max-w-[1400px] py-8">
      <div className="space-y-6">
        <CreateBlogHeader
          title={title}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <Tabs 
          defaultValue="english" 
          value={selectedLanguage}
          onValueChange={(value) => setSelectedLanguage(value as "english" | "tamil")}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="w-full h-12 bg-background border">
              <TabsTrigger value="english" className="w-1/2 h-full data-[state=active]:bg-muted">Write in English</TabsTrigger>
              <TabsTrigger value="tamil" className="w-1/2 h-full data-[state=active]:bg-muted">Write in Tamil</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex justify-end mb-4">
            {selectedLanguage === "english" ? (
              <Button
                onClick={handleTranslate}
                disabled={!hasContent()}
                className="bg-[#FF4747] hover:bg-[#FF4747]/90 text-white"
              >
                <Globe className="mr-2 h-4 w-4" />
                Translate to Tamil
              </Button>
            ) : (
              <Button
                onClick={handleTranslate}
                disabled={!hasContent()}
                className="bg-[#FF4747] hover:bg-[#FF4747]/90 text-white"
              >
                <Globe className="mr-2 h-4 w-4" />
                Translate to English
              </Button>
            )}
          </div>

          <TabsContent value="english" className="mt-0">
            <BlogContentSection
              language="english"
              title={currentTitle}
              content={content}
              onTitleChange={setTitle}
              onContentChange={setContent}
              hasContent={hasContent()}
            />
          </TabsContent>

          <TabsContent value="tamil" className="mt-0">
            <BlogContentSection
              language="tamil"
              title={titleTamil}
              content={contentTamil}
              onTitleChange={setTitleTamil}
              onContentChange={setContentTamil}
              hasContent={hasContent()}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
