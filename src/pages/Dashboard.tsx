
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Writer's Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and manage your blog posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Track your blog performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Create New</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Start writing a new blog post</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
