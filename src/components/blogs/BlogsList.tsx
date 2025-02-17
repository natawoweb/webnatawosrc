
import * as React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface Blog {
  id: string;
  title: string;
  title_tamil?: string;
  cover_image?: string;
  published_at?: string;
  created_at: string;
  blog_categories?: {
    name: string;
  };
  profiles?: {
    full_name: string;
    pseudonym?: string;
  };
  author_name: string;
}

interface BlogsListProps {
  blogs: {
    [year: string]: {
      [month: string]: Array<Blog>;
    };
  };
}

export const BlogsList = ({ blogs }: BlogsListProps) => {
  const { language, t } = useLanguage();

  const getTitle = (blog: Blog) => {
    if (language === 'tamil' && blog.title_tamil) {
      return blog.title_tamil;
    }
    return blog.title;
  };

  return (
    <>
      {Object.entries(blogs)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
        .map(([year, months]) => (
          <div key={year} className="space-y-8">
            <h2 className="text-3xl font-semibold px-4">{year}</h2>
            {Object.entries(months)
              .sort(([monthA], [monthB]) => {
                const dateA = new Date(`${monthA} 1, ${year}`);
                const dateB = new Date(`${monthB} 1, ${year}`);
                return dateB.getTime() - dateA.getTime();
              })
              .map(([month, monthBlogs]) => (
                <div key={`${year}-${month}`} className="space-y-6">
                  <h3 className="text-2xl font-medium text-muted-foreground px-4">{month}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {monthBlogs.map((blog) => (
                      <Link key={blog.id} to={`/blogs/${blog.id}`}>
                        <Card className="flex flex-col hover:shadow-lg transition-shadow h-full">
                          {blog.cover_image && (
                            <img
                              src={blog.cover_image}
                              alt={getTitle(blog)}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <CardHeader className="flex-1">
                            <CardTitle className="text-xl mb-4 leading-relaxed">
                              {getTitle(blog)}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 pb-6">
                            <p className="text-sm text-muted-foreground mb-2">
                              {t("Category:", "வகை:")} {blog.blog_categories?.name || t("Uncategorized", "வகைப்படுத்தப்படாதது")}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              {t("Author:", "ஆசிரியர்:")} {blog.author_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(blog.published_at || blog.created_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
    </>
  );
};
