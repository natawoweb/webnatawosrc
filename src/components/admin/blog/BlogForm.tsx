
import { BlogContentSection } from "./BlogContentSection";
import { CreateBlogHeader } from "./CreateBlogHeader";
import { CreateBlogActions } from "./CreateBlogActions";

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
        />
        
        <CreateBlogActions
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />

        <BlogContentSection
          language={selectedLanguage}
          title={selectedLanguage === "english" ? currentTitle : titleTamil}
          content={selectedLanguage === "english" ? content : contentTamil}
          onTitleChange={selectedLanguage === "english" ? setTitle : setTitleTamil}
          onContentChange={selectedLanguage === "english" ? setContent : setContentTamil}
          onTranslate={selectedLanguage === "english" ? handleTranslate : undefined}
          hasContent={hasContent()}
        />
      </div>
    </div>
  );
}
