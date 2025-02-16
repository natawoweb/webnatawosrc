
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Index from './pages/Index';
import Events from './pages/Events';
import AdminDashboard from './pages/AdminDashboard';
import EventDetails from './pages/EventDetails';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import WriterDashboard from './pages/WriterDashboard';
import { useSession } from "@/hooks/useSession";
import { Navigate } from "react-router-dom";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSession();
  
  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/user-profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/writer/dashboard" 
            element={
              <ProtectedRoute>
                <WriterDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
