
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
  currentPage: number;
  pageSize: number;
}

export const BlogsList = ({ blogs, currentPage, pageSize }: BlogsListProps) => {
  const { language, t } = useLanguage();

  const getTitle = (blog: Blog) => {
    if (language === 'tamil' && blog.title_tamil) {
      return blog.title_tamil;
    }
    return blog.title;
  };

  // Flatten the blogs structure for pagination
  const flattenedBlogs = React.useMemo(() => {
    const flattened: Blog[] = [];
    Object.values(blogs).forEach(yearData => {
      Object.values(yearData).forEach(monthData => {
        flattened.push(...monthData);
      });
    });
    return flattened;
  }, [blogs]);

  // Calculate pagination slice
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBlogs = flattenedBlogs.slice(startIndex, endIndex);

  // Group paginated blogs by date
  const groupedBlogs = paginatedBlogs.reduce((acc: BlogsListProps['blogs'], blog) => {
    const date = new Date(blog.published_at || blog.created_at);
    const year = date.getFullYear().toString();
    const month = date.toLocaleString('default', { month: 'long' });
    
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    
    acc[year][month].push(blog);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedBlogs)
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
                      <Link key={blog.id} to={`/blogs/${blog.id}`} className="block h-full">
                        <Card className="flex flex-col hover:shadow-lg transition-shadow h-full">
                          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                            {blog.cover_image ? (
                              <img
                                src={blog.cover_image}
                                alt={getTitle(blog)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground">No Image</span>
                              </div>
                            )}
                          </div>
                          <CardHeader className="flex-1">
                            <CardTitle className="text-xl line-clamp-2 leading-relaxed mb-2">
                              {getTitle(blog)}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                {t("Category:", "வகை:")} {blog.blog_categories?.name || t("Uncategorized", "வகைப்படுத்தப்படாதது")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("Author:", "ஆசிரியர்:")} {blog.author_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(blog.published_at || blog.created_at).toLocaleDateString()}
                              </p>
                            </div>
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
