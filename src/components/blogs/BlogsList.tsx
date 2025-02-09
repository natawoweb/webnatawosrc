
import * as React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Blog {
  id: string;
  title: string;
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
  return (
    <>
      {Object.entries(blogs)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
        .map(([year, months]) => (
          <div key={year} className="space-y-6">
            <h2 className="text-2xl font-semibold">{year}</h2>
            {Object.entries(months)
              .sort(([monthA], [monthB]) => {
                const dateA = new Date(`${monthA} 1, ${year}`);
                const dateB = new Date(`${monthB} 1, ${year}`);
                return dateB.getTime() - dateA.getTime();
              })
              .map(([month, monthBlogs]) => (
                <div key={`${year}-${month}`} className="space-y-4">
                  <h3 className="text-xl font-medium text-muted-foreground">{month}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthBlogs.map((blog) => (
                      <Link key={blog.id} to={`/blogs/${blog.id}`}>
                        <Card className="flex flex-col hover:shadow-lg transition-shadow">
                          {blog.cover_image && (
                            <img
                              src={blog.cover_image}
                              alt={blog.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <CardHeader>
                            <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Category: {blog.blog_categories?.name || "Uncategorized"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Author: {blog.author_name}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
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
