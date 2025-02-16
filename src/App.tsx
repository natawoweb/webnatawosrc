
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Outlet } from "react-router-dom";
import AdminDashboard from './pages/AdminDashboard';
import EventDetails from './pages/EventDetails';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import WriterDashboard from './pages/WriterDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Outlet />} />
          <Route path="/events" element={<Outlet />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/user-profile" element={<UserProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/writer/dashboard" element={<WriterDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
