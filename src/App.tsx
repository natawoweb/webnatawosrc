
import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import WriterProfile from "./pages/WriterProfile";
import UserProfile from "./pages/UserProfile";
import AdminUserProfile from "./pages/AdminUserProfile";
import Auth from "./pages/Auth";
import SearchWriters from "./pages/SearchWriters";
import Events from "./pages/Events";
import AdminDashboard from "./pages/AdminDashboard";
import CreateBlog from "./pages/CreateBlog";
import EventDetails from "./pages/EventDetails";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Dashboard from "./pages/Dashboard";
import BlogPreview from "./pages/BlogPreview";

// Create a wrapper component for the redirect
const BlogRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/blogs/${id}`} replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="writer/:id" element={<WriterProfile />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="auth" element={<Auth />} />
          <Route path="search" element={<SearchWriters />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/:id" element={<BlogDetail />} />
          <Route path="preview/:id" element={<BlogPreview />} />
          {/* Add redirect for old /blog/:id URLs */}
          <Route path="blog/:id" element={<BlogRedirect />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/user-profile" element={<AdminUserProfile />} />
          <Route path="write" element={<CreateBlog />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
